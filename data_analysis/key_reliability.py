import csv
import json
import os
import statistics
import collections

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

CSV_PATH = os.path.join(os.path.dirname(__file__), "experiments_rows.csv")
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

TRUNCATE_ATTEMPTS = 70  


def load_sessions(filepath):
    """Return list of {session_id, attempts: [...]} where attempts are
    learning + generalization combined and individually sorted by time."""
    sessions = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            session_id = row[3]
            try:
                data = json.loads(row[2])
            except json.JSONDecodeError:
                continue
            learning = data.get("attempts", [])
            gen = data.get("genAttempts", [])
            combined = list(learning) + list(gen)
            if not combined:
                continue
            combined.sort(key=lambda a: a.get("time", 0))
            sessions.append({"session_id": session_id, "attempts": combined})
    return sessions


def realized_reliability(attempts):
    """r = opens / (number-rule matches). Returns (rate, opportunities, opens)."""
    opp = sum(1 for a in attempts if a.get("correct_num") is True)
    opened = sum(
        1 for a in attempts if a.get("correct_num") is True and a.get("correct") is True
    )
    return (opened / opp if opp else None, opp, opened)


def summarize(rates, label):
    rs = [r for r in rates if r is not None]
    if not rs:
        return f"{label}: no data\n"
    return (
        f"{label}: n={len(rs)} "
        f"mean={statistics.mean(rs):.4f} median={statistics.median(rs):.4f} "
        f"sd={statistics.pstdev(rs):.4f} min={min(rs):.4f} max={max(rs):.4f}\n"
    )


def plot_hist_ecdf(rates, title, outpath):
    rs = sorted(r for r in rates if r is not None)
    if not rs:
        print(f"  (no data for {title})")
        return
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4.5))

    # histogram in 0.1 buckets
    buckets = collections.Counter(int(x * 10) / 10 for x in rs)
    xs = [i / 10 for i in range(11)]
    heights = [buckets.get(x, 0) for x in xs]
    ax1.bar(xs, heights, width=0.09, color="#4C72B0", edgecolor="black", alpha=0.85)
    ax1.set_title(f"{title}\nhistogram of per-person reliability")
    ax1.set_xlabel("realized reliability (opens / correct_num==true)")
    ax1.set_ylabel("# adults")
    for x, h in zip(xs, heights):
        if h:
            ax1.text(x, h + 0.1, str(h), ha="center", va="bottom", fontsize=8)
    ax1.set_xlim(0, 1.05)

    # ecdf
    n = len(rs)
    ax2.step(rs, [i / n for i in range(1, n + 1)], where="post", color="#C44E52")
    ax2.axvline(0.7, color="grey", linestyle="--", alpha=0.7, label="oracle mean 0.7")
    ax2.set_title(f"{title}\nECDF")
    ax2.set_xlabel("realized reliability")
    ax2.set_ylabel("cumulative fraction")
    ax2.set_xlim(0, 1.0)
    ax2.legend(loc="upper left")

    plt.tight_layout()
    fig.savefig(outpath, dpi=120)
    plt.close(fig)
    print(f"  wrote {outpath}")


def main():
    sessions = load_sessions(CSV_PATH)
    print(f"Loaded {len(sessions)} sessions from {CSV_PATH}\n")

    # --- raw (all attempts) ---
    raw_rates = []
    opp_counts = []
    for s in sessions:
        r, opp, _ = realized_reliability(s["attempts"])
        raw_rates.append(r)
        if opp:
            opp_counts.append(opp)

    print("Per-opportunity counts (correct_num==true trials/person):")
    print(
        f"  min={min(opp_counts)} median={int(statistics.median(opp_counts))} "
        f"max={max(opp_counts)} mean={statistics.mean(opp_counts):.1f}\n"
    )

    # --- truncated to 70 attempts (learning + generalization, time-ordered) ---
    trunc_rates = []
    n_truncated = 0
    for s in sessions:
        first70 = s["attempts"][:TRUNCATE_ATTEMPTS]
        if len(s["attempts"]) > TRUNCATE_ATTEMPTS:
            n_truncated += 1
        r, _, _ = realized_reliability(first70)
        trunc_rates.append(r)
    print(f"Sessions truncated to {TRUNCATE_ATTEMPTS} attempts: {n_truncated}\n")

    # --- write plots ---
    print("Writing plots:")
    plot_hist_ecdf(
        raw_rates,
        "Adult realized key reliability (all attempts)",
        os.path.join(OUT_DIR, "key_reliability_histogram.png"),
    )
    plot_hist_ecdf(
        trunc_rates,
        f"Adult key reliability (truncated to {TRUNCATE_ATTEMPTS} attempts, LLM-PS-S match)",
        os.path.join(OUT_DIR, "key_reliability_truncated70.png"),
    )

    # --- text summary ---
    lines = []
    lines.append("KEY RELIABILITY SUMMARY\n")
    lines.append(
        "Reliability definition: P(correct | correct_num==true), i.e. probability "
        "the key opens given the number rule was satisfied.\n"
    )
    lines.append(
        f"Generative reliability is fixed at 0.7 by the oracle "
        f"(src/scripts/oracle.js, NUMBER_MATCH_FUZZY) with NO per-person parameter.\n"
        "Observed inter-adult spread is small-sample (binomial) noise, not latent "
        "individual differences. A hierarchical model would recover p_i ~= 0.7.\n"
    )
    lines.append(
        f"Sessions: {len(sessions)}; mean opportunities/person: "
        f"{statistics.mean(opp_counts):.1f} "
        f"(min={min(opp_counts)}, max={max(opp_counts)}).\n"
    )
    lines.append(
        f"Sessions needing truncation to {TRUNCATE_ATTEMPTS} attempts: {n_truncated}.\n\n"
    )
    lines.append(summarize(raw_rates, "All attempts (raw)"))
    lines.append(summarize(trunc_rates, f"Truncated to {TRUNCATE_ATTEMPTS} attempts"))

    # overall (aggregate, sanity-check oracle mean)
    tot_opp = sum(
        1 for s in sessions for a in s["attempts"] if a.get("correct_num") is True
    )
    tot_open = sum(
        1
        for s in sessions
        for a in s["attempts"]
        if a.get("correct_num") is True and a.get("correct") is True
    )
    lines.append(
        f"\nAggregate (all opportunities pooled): {tot_open}/{tot_opp} = "
        f"{tot_open/tot_opp:.4f}  (expect ~0.7 per oracle)\n"
    )

    summary_text = "".join(lines)
    summary_path = os.path.join(OUT_DIR, "key_reliability_summary.txt")
    with open(summary_path, "w") as f:
        f.write(summary_text)
    print(f"\n  wrote {summary_path}")
    print("\n" + summary_text)


if __name__ == "__main__":
    main()