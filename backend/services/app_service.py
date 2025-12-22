from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas

# ==========================================
# APP CONFIG STRUCTURE UPDATE SERVICE
# ==========================================

def reconcile_app_structure(db: Session, db_app: models.AppConfig, app_data: schemas.AppConfigUpdate):
    """
    Synchronizes the full app structure.
    Handles Updating existing items, Creating new ones, and Deleting missing ones.
    Note: Just modifies the ORM objects. Persistence (commit/refresh) is handled by the caller.
    """
    
    # 2. Update App-level fields
    db_app.app_name = app_data.app_name

    # 3. RECONCILE PAGES
    # Create a map of existing pages: {page_id: page_object}
    existing_pages = {page.id: page for page in db_app.pages}
    
    # Track which IDs are present in the new payload
    incoming_page_ids = set()

    for page_data in app_data.pages:
        # Check if this page already exists and belongs to this app
        if page_data.id and page_data.id in existing_pages:
            # --- UPDATE EXISTING PAGE ---
            db_page = existing_pages[page_data.id]
            db_page.title = page_data.title
            db_page.description = page_data.description
            db_page.image_url = page_data.image_url
            db_page.order_index = page_data.order_index
            
            incoming_page_ids.add(page_data.id)
            
            # Recursive sync for children
            _reconcile_inputs(db, db_page, page_data.inputs)
            _reconcile_calculations(db, db_page, page_data.calculations)

        else:
            # --- CREATE NEW PAGE ---
            # Extract child data
            new_page_dict = page_data.dict(exclude={'id', 'inputs', 'calculations'})
            new_page = models.Page(**new_page_dict)
            
            # Manually add nested items for the new page
            for inp in page_data.inputs:
                new_page.inputs.append(models.InputVariable(**inp.dict(exclude={'id'})))
            
            for calc in page_data.calculations:
                new_page.calculations.append(models.Calculation(**calc.dict(exclude={'id'})))
            
            db_app.pages.append(new_page)

    # 4. DELETE ORPHAN PAGES
    # Any existing page ID that was NOT in the incoming list is deleted
    for page_id, db_page in existing_pages.items():
        if page_id not in incoming_page_ids:
            db.delete(db_page)


def _reconcile_inputs(db: Session, db_page: models.Page, inputs_data: List[schemas.InputVariableUpdate]):
    """Helper to reconcile inputs for a specific page"""
    existing_inputs = {i.id: i for i in db_page.inputs}
    incoming_ids = set()

    for inp_data in inputs_data:
        if inp_data.id and inp_data.id in existing_inputs:
            # Update
            db_inp = existing_inputs[inp_data.id]
            db_inp.variable_name = inp_data.variable_name
            db_inp.placeholder = inp_data.placeholder
            incoming_ids.add(inp_data.id)
        else:
            # Create
            new_inp = models.InputVariable(**inp_data.dict(exclude={'id'}))
            db_page.inputs.append(new_inp)

    # Delete
    for inp_id, db_inp in existing_inputs.items():
        if inp_id not in incoming_ids:
            db.delete(db_inp)


def _reconcile_calculations(db: Session, db_page: models.Page, calcs_data: List[schemas.CalculationUpdate]):
    """Helper to reconcile calculations"""
    existing_calcs = {c.id: c for c in db_page.calculations}
    incoming_ids = set()

    for calc_data in calcs_data:
        if calc_data.id and calc_data.id in existing_calcs:
            # Update
            db_calc = existing_calcs[calc_data.id]
            db_calc.output_name = calc_data.output_name
            db_calc.formula = calc_data.formula
            db_calc.unit = calc_data.unit
            incoming_ids.add(calc_data.id)
        else:
            # Create
            new_calc = models.Calculation(**calc_data.dict(exclude={'id'}))
            db_page.calculations.append(new_calc)
            
    # Delete
    for calc_id, db_calc in existing_calcs.items():
        if calc_id not in incoming_ids:
            db.delete(db_calc)
