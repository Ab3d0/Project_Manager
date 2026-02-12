import React from 'react'

interface Props {
    name : string,
    description : string,
    loading : boolean,
    onclose : () => void,
    onChangeName : ( value : string ) => void,
    onChangeDescription : ( value : string ) => void,
    onSubmit: () => void,
    editMode?: boolean


}

const CategoryModel: React.FC<Props> = ({
    name, description, loading, onclose , onChangeDescription, onChangeName, editMode, onSubmit 
}) => {
    return (
        <dialog id="category_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg mb-4">
                {editMode ? "Modifier la catégorie" : "Nouvelle catégorie"}</h3>
            <input 
                type="text"
                placeholder='Nom'
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                className = "input input-bordered w-full mb-4" 
            />
            <input 
                type="text"
                placeholder='Description'
                value={description}
                onChange={(e) => onChangeDescription(e.target.value)}
                className = "input input-bordered w-full mb-4" 
            />   
            <p className="py-4">Click the button below to close</p>
            <button 
                className='btn btn-primary'
                onClick={onSubmit}
                disabled={loading}

            >
                {loading 
                    ? editMode 
                        ? "Modification..." 
                        : "Ajout..." 
                    : editMode 
                        ? "Modifier" 
                        : "Ajouter"
                        
                }

            </button>
            <div className="modal-action">
            <form method="dialog">
                {/* if there is a button, it will close the modal */}
                <button className="btn" onClick={onclose}>Close</button>
            </form>
            </div>
        </div>
        </dialog>
    )
}

export default CategoryModel