"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import CategoryModel from '../components/CategoryModal'
import { useUser } from '@clerk/nextjs'
import { createCategory, deleteCategory, readCategories, updateCategory } from '../actions'
import { toast } from 'react-toastify'
import { Category } from '@/lib/generated/prisma'
import EmptyState from '../components/EmptyState'
import { Pencil, Trash } from 'lucide-react'



const Page = () => {

    const {user, isLoaded} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress as string


    

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
    const [categories, setCategories] = useState<Category[]>([])

    
    /*useEffect(() => {
    if (!email) return; // ne rien faire si email n'existe pas

    const fetchCategories = async () => {
        try {
        const data = await readCategories(email);
        if (data) setCategories(data);
        } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
        }
    };

    fetchCategories();
    }, [email]);*/

    const loadCategories = async () => {
    if (!email) return; // ne rien faire si email n'existe pas
    try {
        const data = await readCategories(email)
        if (data) setCategories(data)
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error)
    }
    }

    useEffect(() => {
        if (!isLoaded || !email) return

        // Fonction async auto-exécutante
        ;(async () => {
            await loadCategories()
        })()
    }, [isLoaded, email])



    const openCreateModal = () => {
        setName("");
        setDescription("");
        setEditMode(false);
        (document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
    }

     const closeModel = () => {
        setName("");
        setDescription("");
        setEditMode(false);
        (document.getElementById("category_modal") as HTMLDialogElement)?.close()
    }


    const handleCreateCategory = async () => {
        setLoading(true)
        if(email){
            await createCategory(name, email, description)
            await loadCategories()
        }
        closeModel()
        setLoading(false)
        toast.success("Categorie créée avec succés")
    }

    const handleUpdateCategory = async () => {
        if(!editingCategoryId) return 
        setLoading(true)
        if(email){
            await updateCategory(editingCategoryId, email, name,  description)
            await loadCategories()
        }
        
        closeModel()
        setLoading(false)
        toast.success("Categorie mise à jour avec succés")
    }

    
    const openEditModal = (category : Category ) => {
        setName(category.name);
        setDescription(category.description || " ");
        setEditMode(true);
        setEditingCategoryId(category.id);
        (document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
    }

    const handleDeleteCategory = async (categoryId : string ) => {
        const confirmDelete = confirm("Voulez-vous vraiment supprimer cette catégorie ? Tous les produits associés seraont également supprimés")
        if(!confirmDelete) {return; }
        await deleteCategory(categoryId , email);
        await loadCategories();
        toast.success("Categorie supprimé avec succés")
        
    }


    return (
        <Wrapper>
            <div>
                <div className="mb-4">
                    <button className='btn btn-primary'
                    onClick={openCreateModal}>
                        Ajouter une catégorie

                    </button>
                </div>

                {categories.length > 0 ? (
                    <div>
                        {categories.map((category) => (
                            <div key={category.id} className='mb-2 p-5 border-2 border-base-200 rounded-3xl flex justify-between items-center '>
                                <div>
                                    <strong className='text-lg'>{category.name}</strong>
                                    <div className='text-sm'>{category.description}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-sm" onClick={() => openEditModal(category)}>
                                        <Pencil className="w-4 h-4"/>
                                    </button>
                                    <button className="btn btn-sm btn-error" onClick={() => handleDeleteCategory(category.id)}>
                                        <Trash className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                    message={"Aucune catégorie est disponible"}
                    IconComponent='Group'
                    />
                )}

                
            </div>

            <CategoryModel
                name={name}
                description={description}
                loading={loading}     
                onclose={closeModel}
                onChangeName={setName}
                onChangeDescription={setDescription}
                onSubmit={editMode ? handleUpdateCategory : handleCreateCategory }
                editMode={editMode}
            />
     
        </Wrapper>
    )
}

export default Page 