import React, {useRef, useState} from 'react'
import {InputTextarea} from 'primereact/inputtextarea'
import {InputText} from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { marked } from 'marked';
import { addNote } from '../api/note/addNote';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

function Homepage() {
  const editorRef = useRef(null)
  const toastRef = useRef(null);
  const [input, setInput] = useState('');
  const [materie, setMaterie] = useState('');
  const [tag, setTag] = useState(''); 
  const [visible, setVisible] = useState(false);

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setInput(value);
    const htmlContent = marked(value);
    editorRef.current.innerHTML = htmlContent;
  }

  const handleSave = async () => {
    const res = await addNote({content: input, materie, tag});
    if (res.error) {
      toastRef.current.show({severity: 'error', summary: 'Error', detail: res.error});
      return;
    }
    toastRef.current.show({severity: 'success', summary: 'Success', detail: res.message});
    setVisible(false);
  }

  return (
    <div>
        <div className='saveButtonContainer' style={{padding: '6px', paddingRight: '1rem', textAlign: 'end'}}>
          <Button label="Save" disabled={input.length === 0} size='small' onClick={() => setVisible(true)} />
        </div>
        <div className='homepageContainer' style={{padding: '1rem', paddingTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'}}>
          <InputTextarea className='hpTextarea' placeholder='Econometrie - Model simplu de regresie unifactorial' value={input} onChange={handleTextareaChange} style={{height: 'calc(100vh - 140px)', width: '50%'}} />
          <div className='markdownEditor' style={{height: 'calc(100vh - 140px)', width: '50%', border: '1px solid #d1d5db', borderRadius: '6px', color: '#4b5563', padding: '1rem', wordWrap: 'break-word', whiteSpace: 'pre', overflow: 'auto'}} ref={editorRef}>
        </div>
        </div>
      <Dialog header="Salveaza notita" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
          <div className="materieContainer" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label htmlFor="materie">Materie (Optional)</label>
              <InputText id="materie" aria-describedby="materie-help" value={materie} onChange={(e) => setMaterie(e.target.value)} />
              <small id="materie-help">
                  Introduce materia la care se refera notita.
              </small>
          </div>
          <div className="tagContainer" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem'}}>
              <label htmlFor="tag">Tag (Optional)</label>
              <InputText id="tag" aria-describedby="tag-help" value={tag} onChange={(e) => setTag(e.target.value)} />
              <small id="tag-help">
                  Introduce un tag pentru notita.
              </small>
          </div>
          <div className='saveButtonContainer' style={{padding: '1rem', textAlign: 'end'}}>
            <Button label="Confirm" severity="success" size='small' onClick={handleSave} />
          </div>
      </Dialog>
      <Toast ref={toastRef} />
    </div>
  )
}

export default Homepage