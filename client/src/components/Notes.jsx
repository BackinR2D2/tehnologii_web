import React, { useEffect, useRef, useState } from 'react'
import { getNotes } from '../api/note/getNotes';
import { Toast } from 'primereact/toast';
import { marked } from 'marked';
import { useNavigate } from 'react-router';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { shortenStr } from '../utils/shortenStr';
import { deleteNote } from '../api/note/deleteNote';
import { InputText } from 'primereact/inputtext';
import {Dropdown} from 'primereact/dropdown';

function Notes() {
    const navigate = useNavigate();
    const toastRef = useRef(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [materieFilter, setMaterieFilter] = useState(null);
    const [tagFilter, setTagFilter] = useState(null);
    const [materii, setMaterii] = useState([]);
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState('');

    const [isFiltering, setIsFiltering] = useState(false);

    const fetchNotes = async () => {
        setLoading(true);
        const response = await getNotes();
        if (response.error) {
            toastRef.current.show({severity: 'error', summary: 'Error', detail: response.error});
            setLoading(false);
            return;
        }
        if(response.data?.error === 'Unauthorized') {
            navigate('/login');
            sessionStorage.removeItem('token');
            setLoading(false);
            window.dispatchEvent(new Event('storage'));
            return;
        }
        setLoading(false);
        setNotes(response.data);
        setMaterii([...new Set(response.data.map(note => note.materie))]);
        setTags([...new Set(response.data.map(note => note.tag))]);
    }

    const handleDeleteNote = async (id) => {
        const response = await deleteNote(id);
        if (response.error) {
            toastRef.current.show({severity: 'error', summary: 'Error', detail: response.error});
            return;
        }
        toastRef.current.show({severity: 'success', summary: 'Success', detail: response.data});
        setNotes(notes.filter(note => note.id !== id));
    }

    const handleFilter = async () => {
        setLoading(true);
        setIsFiltering(true);
        const response = await getNotes(tagFilter, materieFilter, search);
        if (response.error) {
            toastRef.current.show({severity: 'error', summary: 'Error', detail: response.error});
            setIsFiltering(false);
            setLoading(false);
            return;
        }
        if(response.data?.error === 'Unauthorized') {
            navigate('/login');
            sessionStorage.removeItem('token');
            setLoading(false);
            setIsFiltering(false);
            window.dispatchEvent(new Event('storage'));
            return;
        }
        setLoading(false);
        setNotes(response.data);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

  return (
    <div className='notesContainer' style={{padding: '1rem', height: 'calc(100vh - 120px)', overflow: 'auto'}}>
        {
            loading ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <ProgressSpinner />
                </div>
                :
                <>
                {
                    notes.length === 0 ?
                        <>
                            {
                                isFiltering ?
                                <div className='notesSearchAndFilterContainer' style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
                                    <div className='searchContainer'>
                                        <InputText value={search} onChange={(e) => setSearch(e.target.value)} type='text' placeholder='Search...' style={{padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', width: '300px'}} />
                                    </div>
                                    <div className='materieFilterContainer'>
                                        <Dropdown showClear style={{height: '34px'}} value={materieFilter} options={materii} onChange={(e) => setMaterieFilter(e.value)} placeholder='Materie' />
                                    </div>
                                    <div className='tagFilterContainer'>
                                        <Dropdown showClear style={{height: '34px'}} value={tagFilter} options={tags} onChange={(e) => setTagFilter(e.value)} placeholder='Tag' />
                                    </div>
                                    <div className='filterButtonContainer'>
                                        <Button style={{height: '34px'}} label='Filter' onClick={handleFilter} />
                                    </div>
                                    {
                                        isFiltering ?
                                        <div className='clearFiltersButtonContainer'>
                                            <Button style={{height: '34px'}} label='Clear Filters' severity='danger' onClick={() => {
                                                setMaterieFilter(null);
                                                setTagFilter(null);
                                                setSearch('');
                                                setIsFiltering(false);
                                                fetchNotes();
                                            }} />
                                        </div>
                                        :
                                        <></>
                                    }
                                </div>
                                :
                                <></>
                            }
                            <div className='noNotesAvailableContainer' style={{padding: '1rem', border: '1px solid #d1d5db', borderRadius: '6px'}}>
                                <h2 style={{color: '#4b5563', fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center'}}>
                                    Nu exista nicio notita
                                </h2>
                                <p style={{color: '#6b7280', fontSize: '1rem', marginTop: '0.5rem', marginBottom: 0, lineHeight: '1.5', textAlign: 'center', wordWrap: 'break-word'}}>
                                    Mergi pe pagina de <span style={{color: '#3b82f6', cursor: 'pointer'}} onClick={() => navigate('/')}>home</span> pentru a adauga o notita.
                                </p>
                            </div>
                        </>
                        :
                        <div>
                            <div className='notesSearchAndFilterContainer' style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
                                <div className='searchContainer'>
                                    <InputText value={search} onChange={(e) => setSearch(e.target.value)} type='text' placeholder='Search...' style={{padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', width: '300px'}} />
                                </div>
                                <div className='materieFilterContainer'>
                                    <Dropdown showClear style={{height: '34px'}} value={materieFilter} options={materii} onChange={(e) => setMaterieFilter(e.value)} placeholder='Materie' />
                                </div>
                                <div className='tagFilterContainer'>
                                    <Dropdown showClear style={{height: '34px'}} value={tagFilter} options={tags} onChange={(e) => setTagFilter(e.value)} placeholder='Tag' />
                                </div>
                                <div className='filterButtonContainer'>
                                    <Button style={{height: '34px'}} label='Filter' onClick={handleFilter} disabled={materieFilter === null && tagFilter === null && search === ''} />
                                </div>
                                {
                                    isFiltering ?
                                    <div className='clearFiltersButtonContainer'>
                                        <Button style={{height: '34px'}} label='Clear Filters' severity='danger' onClick={() => {
                                            setMaterieFilter(null);
                                            setTagFilter(null);
                                            setSearch('');
                                            setIsFiltering(false);
                                            fetchNotes();
                                        }} />
                                    </div>
                                    :
                                    <></>
                                }
                            </div>
                            <div className='notes' style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem'}}>
                                {
                                    notes?.map(note => (
                                    <div key={note?.id} style={{border: '1px solid #d1d5db', borderRadius: '6px', padding: '1rem', cursor: 'pointer', overflow: 'auto'}} className='note' onClick={() => {
                                            navigate(`/notes/${note?.id}`);
                                    }}>
                                        <div key={note?.id} dangerouslySetInnerHTML={{__html: shortenStr(marked(note?.content), 50)}} className='note' style={{wordWrap: 'break-word', whiteSpace: 'pre', overflow: 'auto', height: '180px', maxHeight: '180px'}}></div>
                                        <hr />
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem'}}>
                                            <div>{note?.materie}</div>
                                            <div>{note?.tag}</div>
                                            <div>{new Date(note?.createdAt)?.toLocaleDateString()}</div>
                                        </div>
                                        <div className='deleteNoteButtonContainer' style={{textAlign: 'end', paddingTop: '1rem'}}>
                                            <Button label="Delete" severity='danger' size='small' onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNote(note?.id);
                                            }} />
                                        </div>
                                    </div>
                                    ))
                                }
                            </div>
                        </div>
                }
                </>
        }
        <Toast ref={toastRef} />
    </div>
  )
}

export default Notes