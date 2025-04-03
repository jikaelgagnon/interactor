from firebase_admin import credentials, firestore
import pandas as pd

def get_all_records(db: firestore.Client):
    """
    Retrieve all documents from the userData collection.
    
    Args:
        db (firestore.Client): Firestore database client instance
        
    Returns:
        list: List of documents as dictionaries
    """
    docs = db.collection('userData').stream()
    return [doc.to_dict() for doc in docs]


def get_record_by_id(db: firestore.Client, id:str):
    """
    Retrieve document with the given id from the userData collection if it exists, else return None.
    
    Args:
        db (firestore.Client): Firestore database client instance
        id (str): The id of the document
        
    Returns:
        dict: the document as a dictionary, if found
    """
    doc_ref = db.collection("userData").document(id)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return None
    
def get_records_by_email(db: firestore.Client, email: str):
    """
    Retrieve document with the given id from the userData collection if it exists, else return None.
    
    Args:
        db (firestore.Client): Firestore database client instance
        email (str): the email of the client
        
    Returns:
        list: All documents with the corresponding email as dictionaries
    """
    query = db.collection('userData').where('sessionInfo.email', '==', email)
    results = query.stream()
    return [doc.to_dict() for doc in results]

def create_nested_tables(record: dict):
    # Create DataFrame for documents
    doc_df = pd.DataFrame(record['documents'])
    
    # Create main DataFrame with session info
    main_df = pd.DataFrame({
        'email': [record['sessionInfo']['email']],
        'url': [record['sessionInfo']['url']],
        'documents': [doc_df]
    })
    
    return main_df