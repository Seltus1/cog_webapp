import csv
import json
import pandas as pd

# Define colors based on the experiment
COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 
          'pink', 'grey', 'brown', 'teal', 'cream', 'white', 'black', 'lilac']

def extract_color(name_string):
    if pd.isna(name_string): return None
    for color in COLORS:
        if color in str(name_string).lower(): return color
    return None

def isolate_stubborn_users(filepath):
    all_attempts = []
    
    # 1. Load Data (same as before)
    with open(filepath, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        header = next(csv_reader) 
        
        for row in csv_reader:
            session_id = row[3] 
            try:
                data = json.loads(row[2])
            except json.JSONDecodeError:
                continue
            
            combined_attempts = data.get('attempts', []) + data.get('genAttempts', [])
            rule_guess = data.get('rule_guess', 'NO_GUESS_PROVIDED')
            
            for attempt in combined_attempts:
                attempt['session_id'] = session_id
                attempt['final_rule_guess'] = rule_guess # Attach their final guess to see what they were thinking!
                all_attempts.append(attempt)
                
    df = pd.DataFrame(all_attempts)
    
    # 2. Re-apply the Logic Flags
    df['key_color'] = df['keyName'].apply(extract_color)
    df['door_color'] = df['doorName'].apply(extract_color)
    df['is_color_match'] = (df['key_color'] == df['door_color']) & df['key_color'].notna()
    
    df['keyNumber'] = pd.to_numeric(df['keyNumber'], errors='coerce')
    df['doorNumber'] = pd.to_numeric(df['doorNumber'], errors='coerce')
    df['is_number_match'] = (df['keyNumber'] == df['doorNumber']) & df['keyNumber'].notna()
    
    df = df.sort_values(by=['session_id', 'time'])
    
    never_shifted_session_ids = []
    
    # 3. Find the users who NEVER shifted
    for session_id, user_data in df.groupby('session_id'):
        # Check if they ever made a pure number match
        number_matches = user_data[(user_data['is_number_match'] == True) & (user_data['is_color_match'] == False)]
        
        if number_matches.empty:
            never_shifted_session_ids.append(session_id)
            
    # 4. Isolate the DataFrame to ONLY these users
    isolated_df = df[df['session_id'].isin(never_shifted_session_ids)]
    
    print(f"🔍 Found {len(never_shifted_session_ids)} users who never shifted.\n")
    print("="*60)
    
    # 5. Print a readable play-by-play for manual inspection
    for session_id in never_shifted_session_ids:
        user_data = isolated_df[isolated_df['session_id'] == session_id]
        final_guess = user_data['final_rule_guess'].iloc[0]
        total_clicks = len(user_data)
        
        print(f"\n👤 SESSION: {session_id}")
        print(f"📝 FINAL GUESS: '{final_guess}'")
        print(f"🖱️ TOTAL CLICKS: {total_clicks}")
        print("-" * 60)
        
        # Print only the relevant columns to see their behavior
        display_columns = ['phase', 'keyName', 'doorName', 'is_color_match', 'correct']
        print(user_data[display_columns].to_string(index=False))
        print("="*60)

# Run the isolation script
isolate_stubborn_users('experiments_rows.csv')