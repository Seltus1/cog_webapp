import csv
import json
from dataclasses import dataclass, field

@dataclass
class Participant:
    gen_attempts: str
    lear_attempts: str
    session_id: str
    #Out of 4, how many gen attempts did the user get right
    correct_gen_attempt: int
    rule_found: bool = field(init=False)
    gender: str
    age: int
    
    def __post_init__(self):
        self.rule_found = self.correct_gen_attempt == 4

def generate_session_json(input_filepath, output_filepath, participants: list) -> list:
    """
    Reads the experiment CSV and exports a master JSON file where 
    each object represents one complete user session.
    """
    all_sessions = []
    
    with open(input_filepath, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        
        # Skip the CSV header row
        header = next(csv_reader) 
        
        for row in csv_reader:
            session_id = row[3] # Column D: session_id
            
            try:
                data = json.loads(row[2]) # Column C: JSON data
            except json.JSONDecodeError:
                continue
                
            # Build the complete session profile using .get() for safety
            p = Participant(data.get('genAttempts', 'N/A'), data.get('attempts', 'N/A'), session_id, correct_gen_attempt=-1, gender=data.get('gender', 'N/A'), age=data.get('age', 'N/A'))
            extract_attempts(p)
            
            session_record = {
                "session_id": session_id,
                "age": data.get('age', 'N/A'),
                "gender": data.get('gender', 'N/A'),
                "hypothesis": data.get('hypothesis', 'N/A'),
                "rule_guess": data.get('rule_guess', 'N/A'),
                "comment": data.get('comments', ''),
                "completion_code": data.get('completion_code', 'N/A'),
                "ip_address": data.get('ip_address', 'N/A'),
                "correct_gen_attempt": p.correct_gen_attempt
            }
            participants.append(p)
            
            all_sessions.append(session_record)
            
                
    # Save everything to a new JSON file
    with open(output_filepath, mode='w', encoding='utf-8') as outfile:
        json.dump(all_sessions, outfile, indent=4)
    
        
    print(f"✅ Successfully exported {len(all_sessions)} total sessions to {output_filepath}")
    return participants



def extract_attempts(p: Participant):
    count = 0
    for attempt in p.gen_attempts:
        if attempt['correct'] or attempt['correct'] == 'true':
            count += 1
    p.correct_gen_attempt = count



def merge_jsons(input_file, code_file, output_file):
    combined = []
    with open(input_file, "r", encoding='utf-8') as f:
        input_data = json.load(f)
    
    with open(code_file, "r", encoding='utf-8') as f:
        code_data = json.load(f)
    
    lookup = {session["session_id"]: session for session in code_data }
    
    for session in input_data:
        key = session["session_id"]
        
        if key in lookup:
            comment_analysis = lookup[key]
            merged = {**session, **comment_analysis}
            combined.append(merged)
    with open(output_file, mode='w', encoding='utf-8') as outfile:
        json.dump(combined, outfile, indent=4)
        

# ==========================================
# Execution Block
# ==========================================
if __name__ == "__main__":
    input_file = 'experiments_rows.csv'
    output_file = 'session_level_export.json'
    code_file = 'coded_output.json'
    final_output = 'results.json'
    participants = []
    
    generate_session_json(input_file, output_file, participants)
    merge_jsons(input_file=output_file, code_file=code_file, output_file=final_output)
