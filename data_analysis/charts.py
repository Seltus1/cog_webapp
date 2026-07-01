import csv
import json
import pandas as pd
import matplotlib.pyplot as plt

# Define colors based on the experiment's naming conventions
COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 
          'pink', 'grey', 'brown', 'teal', 'cream', 'white', 'black', 'lilac']

def extract_color(name_string):
    """Helper function to extract a color word from a key or door name."""
    if pd.isna(name_string):
        return None
    name_lower = str(name_string).lower()
    for color in COLORS:
        if color in name_lower:
            return color
    return None

def load_and_flatten_data(filepath):
    """Parses the CSV and JSON, flattening attempts into a Pandas DataFrame."""
    all_attempts = []
    
    with open(filepath, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        header = next(csv_reader) 
        
        for row in csv_reader:
            session_id = row[3] # Assuming session_id is the 4th column
            try:
                data = json.loads(row[2]) # Assuming JSON is the 3rd column
            except json.JSONDecodeError:
                continue
            
            # Combine learning and generalization attempts into one timeline
            learning_attempts = data.get('attempts', [])
            gen_attempts = data.get('genAttempts', [])
            combined_attempts = learning_attempts + gen_attempts
            
            if not combined_attempts:
                continue
                
            for attempt in combined_attempts:
                attempt['session_id'] = session_id
                all_attempts.append(attempt)
                
    return pd.DataFrame(all_attempts)

def plot_total_time(df):
    """
    Plots a histogram of the total time (in seconds) users took to complete the study.
    """
    # Calculate difference between last action and first action per user
    time_per_user_ms = df.groupby('session_id')['time'].agg(lambda x: x.max() - x.min())
    time_per_user_sec = time_per_user_ms / 1000
    
    plt.figure(figsize=(8, 5))
    time_per_user_sec.plot(kind='hist', bins=15, color='mediumseagreen', edgecolor='black', alpha=0.8)
    
    plt.title('Total Time to Complete Study')
    plt.xlabel('Total Time (Seconds)')
    plt.ylabel('Number of Users')
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    plt.show()

def plot_total_attempts(df):
    """
    Plots a histogram of the total number of attempts (learning + generalization) per user.
    """
    # Count rows per session_id
    attempts_per_user = df.groupby('session_id').size()
    
    plt.figure(figsize=(8, 5))
    attempts_per_user.plot(kind='hist', bins=15, color='coral', edgecolor='black', alpha=0.8)
    
    plt.title('Total Number of Attempts per User')
    plt.xlabel('Number of Attempts')
    plt.ylabel('Number of Users')
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    plt.show()

def plot_strategy_shift(df):
    """
    Plots a histogram showing how many trials it took users to abandon 
    color matching and successfully shift to number matching.
    """
    # 1. Extract colors
    df['key_color'] = df['keyName'].apply(extract_color)
    df['door_color'] = df['doorName'].apply(extract_color)
    
    # 2. Define our logic flags
    df['is_color_match'] = (df['key_color'] == df['door_color']) & df['key_color'].notna()
    
    # Ensuring we handle missing numbers safely
    df['keyNumber'] = pd.to_numeric(df['keyNumber'], errors='coerce')
    df['doorNumber'] = pd.to_numeric(df['doorNumber'], errors='coerce')
    df['is_number_match'] = (df['keyNumber'] == df['doorNumber']) & df['keyNumber'].notna()
    
    # 3. Sort chronologically to ensure trial order is correct
    df = df.sort_values(by=['session_id', 'time'])
    
    trials_until_shift = []
    users_who_never_shifted = 0
    
    for session_id, user_data in df.groupby('session_id'):
        user_data = user_data.reset_index(drop=True)
        
        # We are looking for the moment they execute a pure number match 
        # (matching numbers, but explicitly NOT matching colors)
        number_matches = user_data[(user_data['is_number_match'] == True) & (user_data['is_color_match'] == False)]
        
        if not number_matches.empty:
            # The index of their first true number match equals the number of prior trials
            first_shift_idx = number_matches.index[0]
            trials_until_shift.append(first_shift_idx)
        else:
            users_who_never_shifted += 1
            
    # 4. Plotting
    if not trials_until_shift:
        print("No users in this dataset successfully shifted to number matching.")
        return

    plt.figure(figsize=(8, 5))
    max_trials = max(trials_until_shift)
    bins = range(max_trials + 2)
    
    plt.hist(trials_until_shift, bins=bins, color='mediumpurple', edgecolor='black', alpha=0.8, align='left')
    
    plt.title('Trials Before Shifting to Number Matching Strategy')
    plt.xlabel('Number of Prior Attempts')
    plt.ylabel('Number of Users')
    plt.xticks(range(max_trials + 1))
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    # Add an inset note for users who failed to shift
    plt.figtext(0.15, 0.8, f"Users who NEVER shifted: {users_who_never_shifted}", 
                fontsize=10, bbox=dict(facecolor='white', alpha=0.8))
    
    plt.tight_layout()
    plt.show()

# ==========================================
# Execution Block
# ==========================================
if __name__ == "__main__":
    filepath = 'experiments_rows.csv' 
    
    # Load the data
    df = load_and_flatten_data(filepath)
    
    # Generate the histograms
    plot_total_time(df)
    plot_total_attempts(df)
    plot_strategy_shift(df)