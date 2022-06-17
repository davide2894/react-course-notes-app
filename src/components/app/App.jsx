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

  /**
   * Challenge: complete and implement the deleteNote function
   * 
   * Hints: 
   * 1. What array method can be used to return a new
   *    array that has filtered out an item based 
   *    on a condition?
   * 2. Notice the parameters being based to the function
   *    and think about how both of those parameters
   *    can be passed in during the onClick event handler
   */
  
  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
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
                deleteNoteHandler={deleteNote}
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
