import csv
import json
import pandas as pd
import matplotlib.pyplot as plt

COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 
          'pink', 'grey', 'brown', 'teal', 'cream', 'white', 'black', 'lilac']

def extract_color(name_string):
    if pd.isna(name_string):
        return None
    name_lower = str(name_string).lower()
    for color in COLORS:
        if color in name_lower:
            return color
    return None

def load_and_flatten_data(filepath):
    all_attempts = []
    with open(filepath, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        header = next(csv_reader) 
        
        for row in csv_reader:
            session_id = row[3] 
            try:
                data = json.loads(row[2])
            except json.JSONDecodeError:
                continue
            
            learning_attempts = data.get('attempts', [])
            gen_attempts = data.get('genAttempts', [])
            combined_attempts = learning_attempts + gen_attempts
            
            if not combined_attempts:
                continue
                
            for attempt in combined_attempts:
                attempt['session_id'] = session_id
                all_attempts.append(attempt)
                
    return pd.DataFrame(all_attempts)

def plot_time_per_user(df):
    """
    Plots a bar chart of total time taken, with individual users on the X-axis.
    """
    time_per_user_ms = df.groupby('session_id')['time'].agg(lambda x: x.max() - x.min())
    time_per_user_sec = time_per_user_ms / 1000
    
    # Sort from longest time to shortest time for a clean curve
    time_per_user_sec = time_per_user_sec.sort_values(ascending=False).reset_index(drop=True)
    
    plt.figure(figsize=(10, 5))
    time_per_user_sec.plot(kind='bar', color='mediumseagreen', edgecolor='black')
    
    plt.title('Total Time Taken by Each User (Ranked)')
    plt.xlabel('Individual Users (Sorted by Duration)')
    plt.ylabel('Total Time (Seconds)')
    
    # Hide the messy X-ticks, or replace them with simple numbers
    plt.xticks(ticks=range(len(time_per_user_sec)), labels=[f"{i+1}" for i in range(len(time_per_user_sec))], rotation=90, fontsize=8)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    plt.show()

def plot_attempts_per_user(df):
    """
    Plots a bar chart of total attempts, with individual users on the X-axis.
    """
    attempts_per_user = df.groupby('session_id').size()
    
    # Sort from most attempts to fewest
    attempts_per_user = attempts_per_user.sort_values(ascending=False).reset_index(drop=True)
    
    plt.figure(figsize=(10, 5))
    attempts_per_user.plot(kind='bar', color='coral', edgecolor='black')
    
    plt.title('Total Attempts by Each User (Ranked)')
    plt.xlabel('Individual Users (Sorted by Attempt Count)')
    plt.ylabel('Total Number of Attempts')
    
    plt.xticks(ticks=range(len(attempts_per_user)), labels=[f"{i+1}" for i in range(len(attempts_per_user))], rotation=90, fontsize=8)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    plt.show()

def plot_shift_per_user(df):
    """
    Plots a bar chart showing the exact number of trials it took EACH user 
    to shift strategies.
    """
    df['key_color'] = df['keyName'].apply(extract_color)
    df['door_color'] = df['doorName'].apply(extract_color)
    df['is_color_match'] = (df['key_color'] == df['door_color']) & df['key_color'].notna()
    
    df['keyNumber'] = pd.to_numeric(df['keyNumber'], errors='coerce')
    df['doorNumber'] = pd.to_numeric(df['doorNumber'], errors='coerce')
    df['is_number_match'] = (df['keyNumber'] == df['doorNumber']) & df['keyNumber'].notna()
    
    df = df.sort_values(by=['session_id', 'time'])
    
    shift_data = {}
    users_who_never_shifted = 0
    
    for session_id, user_data in df.groupby('session_id'):
        user_data = user_data.reset_index(drop=True)
        number_matches = user_data[(user_data['is_number_match'] == True) & (user_data['is_color_match'] == False)]
        
        if not number_matches.empty:
            shift_data[session_id] = number_matches.index[0]
        else:
            users_who_never_shifted += 1
            
    if not shift_data:
        print("No users in this dataset successfully shifted to number matching.")
        return

    # Convert to Series and sort from most stubborn to fastest shifter
    shift_series = pd.Series(shift_data).sort_values(ascending=False).reset_index(drop=True)

    plt.figure(figsize=(10, 5))
    shift_series.plot(kind='bar', color='mediumpurple', edgecolor='black')
    
    plt.title('Trials Before Strategy Shift per User (Ranked)')
    plt.xlabel('Individual Users (Sorted by Stubbornness)')
    plt.ylabel('Number of Prior Attempts')
    
    plt.xticks(ticks=range(len(shift_series)), labels=[f"{i+1}" for i in range(len(shift_series))], rotation=90, fontsize=8)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    plt.figtext(0.70, 0.8, f"Users who NEVER shifted: {users_who_never_shifted}", 
                fontsize=10, bbox=dict(facecolor='white', alpha=0.8))
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    filepath = 'experiments_rows.csv' 
    df = load_and_flatten_data(filepath)
    
    plot_time_per_user(df)
    plot_attempts_per_user(df)
    plot_shift_per_user(df)