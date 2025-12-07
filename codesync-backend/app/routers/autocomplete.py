from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["autocomplete"])

class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str

class AutocompleteResponse(BaseModel):
    suggestion: str

@router.post("/autocomplete", response_model=AutocompleteResponse)
async def autocomplete(req: AutocompleteRequest):
    left = req.code[:req.cursorPosition]
    suggestion = ""
    
    # Only Python autocomplete for now
    if req.language.lower() == "python":
        parts = left.split()
        last = parts[-1] if parts else ""

        # --- IMPORT SUGGESTIONS ---
        if last.startswith("imp"):
            suggestion = "ort os\n\nos.listdir('.')\n"
        
        elif last.startswith("from"):
            suggestion = " module import something\n"

        # --- FUNCTION TEMPLATE ---
        elif last == "def":
            suggestion = " function_name(param1, param2):\n    \"\"\"Function description\"\"\"\n    pass\n"

        elif left.strip().endswith("def"):
            suggestion = " function_name():\n    pass\n"

        # --- CLASS TEMPLATE ---
        elif last == "class":
            suggestion = " ClassName:\n    def __init__(self):\n        pass\n"

        # --- IF / ELIF / ELSE ---
        elif left.strip().endswith("if"):
            suggestion = " condition:\n    pass\n"

        elif left.strip().endswith("elif"):
            suggestion = " condition:\n    pass\n"

        elif left.strip().endswith("else"):
            suggestion = ":\n    pass\n"

        # --- LOOP SUGGESTIONS ---
        elif last == "for":
            suggestion = " i in range(0, 10):\n    print(i)\n"

        elif last == "while":
            suggestion = " condition:\n    break\n"

        # --- PRINT SUGGESTION ---
        elif last.startswith("pri"):
            suggestion = "nt(\"Hello World\")\n"

        # --- VARIABLE ASSIGNMENT ---
        elif last == "=":
            suggestion = " 0  # default value\n"

        # --- LIST / DICT TEMPLATES ---
        elif last == "[":
            suggestion = "]  # list\n"
        elif last == "{":
            suggestion = "}  # dict\n"

        # --- DEFAULT BEHAVIOR ---
        else:
            # Return line-level hint
            i = left.rfind("\n")
            last_line = left[i+1:req.cursorPosition] if i >= 0 else left
            suggestion = (last_line + "  # hint").strip()

    else:
        suggestion = "// suggestion: keep typing"

    return {"suggestion": suggestion}
