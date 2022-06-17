import "./App.scss";
import Sidebar from "../sidebar/Sidebar"
import Editor from "../editor/Editor"
import Split from "react-split"
import {useState} from "react";
import {nanoid} from "nanoid"
import { data } from "../../data/data";
import { useEffect } from "react";

function App() {
  /**
   * Challenge: When the user edits a note, reposition
   * it in the list of notes to the top of the list
   */

  
  const localStorageNotesAppKey = "appNotes";
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem(localStorageNotesAppKey)) || []
  );

  const [currentNoteId, setCurrentNoteId] = useState(
      (notes[0] && notes[0].id) || ""
  );
  
  useEffect(() => {
    localStorage.setItem(localStorageNotesAppKey, JSON.stringify(notes));
  },[notes])

  function createNewNote() {
      const newNote = {
          id: nanoid(),
          body: "# Type your markdown note's title here"
      };
      
      setNotes(prevNotes => [...prevNotes, newNote]);
      
      setCurrentNoteId(newNote.id)
  }
  
  function updateNote(text) {
    setNotes(oldNotes => {
      const newArr = [];
      oldNotes.forEach((oldNote) => {
        if(oldNote.id === currentNoteId){
          newArr.unshift({ ...oldNote, body: text });
        } else {
          newArr.push(oldNote)
        }
      });
      return newArr;
    });
  }
  
  function findCurrentNote() {
      return notes.find(note => {
          return note.id === currentNoteId
      }) || notes[0]
  }

  
  return (
    <main>
    {
        notes.length > 0 
        ?
        <Split 
            sizes={[30, 70]} 
            direction="horizontal" 
            className="split"
        >
            <Sidebar
                notes={notes}
                currentNote={findCurrentNote()}
                setCurrentNoteId={setCurrentNoteId}
                newNote={createNewNote}
            />
            {
                currentNoteId && 
                notes.length > 0 &&
                <Editor 
                    currentNote={findCurrentNote()} 
                    updateNote={updateNote} 
                />
            }
        </Split>
        :
        <div className="no-notes">
            <h1>You have no notes</h1>
            <button 
                className="first-note" 
                onClick={createNewNote}
            >
                Create one now
            </button>
        </div>
        
    }
    </main>
  );
}

export default App;
