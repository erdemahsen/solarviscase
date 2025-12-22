from typing import List, Dict, Any
from .. import schemas

# Moved from main.py
def calculate_results(payload: Dict[str, Any], db_calculations: List[schemas.Calculation]):
    # 1. Extract formData
    raw_inputs = payload.get("formData", {})
    
    # --- Convert Strings to Numbers ---
    user_inputs = {}
    for key, value in raw_inputs.items():
        try:
            if value == "":
                user_inputs[key] = 0.0
            else:
                user_inputs[key] = float(value)
        except (ValueError, TypeError):
            user_inputs[key] = value

    print("Sanitized inputs:", user_inputs) 

    results = []
    
    # 3. Calculate
    for calc in db_calculations:
        try:
            # Using simple_eval for better safety if installed, else eval
            # calculated_value = simple_eval(calc.formula, names=user_inputs)
            
            # Using eval (be careful in production)
            calculated_value = eval(calc.formula, {"__builtins__": None}, user_inputs)
            
            results.append({
                "key": calc.output_name,
                "value": calculated_value,
                "unit": calc.unit
            })
            
            # Add result to inputs for chaining formulas
            user_inputs[calc.output_name] = calculated_value

        except Exception as e:
            print(f"Error calculating {calc.output_name}: {e}")
            results.append({
                "key": calc.output_name,
                "value": "Error", 
                "unit": "Error"
            })

    return results
