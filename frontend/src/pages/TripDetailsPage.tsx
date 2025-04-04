import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExpenses, addExpense, deleteExpense, updateExpense } from '../api/expenses';
import { fetchTripDetails, deleteTrip, updateTrip } from '../api/trips';
import { fetchCategories, addCategory } from '../api/categories';
import ExpensesPieChart from '../components/ExpensesPieChart';
import FloatingWindow from '../components/FloatingWindow';
import useTranslation from '../utils/useTranslation';
import DailyExpensesBarChart from '../components/ExpensesBarChart';
import Input from '../components/Input';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface Expense {
    id: number;
    tripId: number;
    categoryId: number;
    categoryName: string;
    amount: number;
    description?: string;
    date: string;
};

interface Category {
    id: number;
    name: string;
};

interface Trip {
    id: number;
    name: string;
    budget: number;
    startDate: string;
    endDate: string;
    image: string;
    destination: string;
};
interface SharedUser {
    userId: number;
    email: string;
    role: string;
};

export default function TripDetailsPage() {
    const { user } = useUser();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [newShareEmail, setNewShareEmail] = useState('');
    const [newTrip, setNewTrip] = useState<Trip | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showSharePanel, setShowSharePanel] = useState(false);
    const [showByDay, setShowByDay] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newExpense, setNewExpense] = useState({
        categoryId: 0,
        categoryName: "",
        amount: 0,
        description: '',
        date: '',
    });
    const [newCategory, setNewCategory] = useState('');
    const [tripEditMode, setTripEditMode] = useState(false);


    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const t = useTranslation();

    const formatDateForInput = (date: string) => date.split('T')[0];

    useEffect(() => {
        if (id) {
            Promise.all([
                fetchTripDetails(Number(id)),
                fetchExpenses(Number(id)),
                fetchCategories(),
            ])
                .then(([tripData, expensesData, categoriesData]) => {
                    setTrip(tripData);
                    setExpenses(expensesData.expenses);
                    const combinedCategories = [...categoriesData, ...expensesData.tripCategories];
                    const uniqueCategories = combinedCategories.filter((category, index, self) =>
                        index === self.findIndex((c) => c.id === category.id)
                    );
                    setCategories(uniqueCategories);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const totalSpent = expenses.reduce((total, expense) => total + Number(expense.amount), 0);
    const budgetRemaining = trip?.budget ? trip.budget - totalSpent : 0;
    const budgetPercentage = trip?.budget ? (totalSpent / trip.budget) * 100 : 0;


    useEffect(() => {
        // if (showAddExpense) {
        //     document.body.style.overflow = 'hidden'
        // }
        // else
        //     document.body.style.overflow = ''
    }, [showAddExpense, showAddCategory]);
    const handleAddExpense = async () => {
        try {
            const expense = await addExpense({ ...newExpense, tripId: Number(id) });
            setExpenses([...expenses, { ...newExpense, id: expense.id }]);
            setShowAddExpense(false);
            setNewExpense({
                categoryId: 0,
                categoryName: "",
                amount: "",
                description: '',
                date: '',
            });
        } catch (error) {
            console.error(t.failedToAddExpense, error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory) return;
        try {
            const category = await addCategory(newCategory);
            setCategories([...categories, category]);
            setNewCategory('');
            setShowAddCategory(false);
            // Set the newly added category as selected
            setNewExpense((prevExpense) => ({
                ...prevExpense,
                categoryId: category.id,
                categoryName: category.name,
            }));
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    const handleUpdateExpense = async () => {
        if (!editingExpense) return;

        try {
            await updateExpense(editingExpense);
            setExpenses((prevExpenses) =>
                prevExpenses.map((expense) =>
                    expense.id === editingExpense.id ? editingExpense : expense
                )
            );
            setEditingExpense(null);
        } catch (error) {
            console.error(t.failedToUpdateExpense, error);
        }
    };

    const handleDeleteExpense = async (expenseId: number) => {
        try {
            await deleteExpense(expenseId);
            setExpenses(expenses.filter((expense) => expense.id !== expenseId));
        } catch (error) {
            console.error(t.failedToDeleteExpense, error);
        }
    };

    const handleDeleteTrip = async () => {
        const confirm = window.confirm(t.confirmDeleteTrip);
        if (confirm && id) {
            try {
                await deleteTrip(Number(id));
                navigate('/trips');
            } catch (error) {
                console.error(t.failedToDeleteTrip, error);
            }
        }
    };


    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Handle click outside menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleShare = async () => {
        try {
            const response = await axios.post(`http://localhost:5001/api/trips/${trip?.id}/add-user`, { email: newShareEmail }, { withCredentials: true });
            console.log(response.data.message);
            // Clear the input field and close the share panel
            setNewShareEmail('');
            // setShowSharePanel(false);
            // Optionally, you can fetch the updated shared users list
            fetchSharedUsers();
        } catch (error) {
            console.error('Failed to share trip:', error);
            console.log('Failed to share trip');
        }
    };

    const fetchSharedUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/trips/${trip?.id}/users`, { withCredentials: true });
            setSharedUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch shared users:', error);
        }
    };
    useEffect(() => {
        if (showSharePanel) {
            fetchSharedUsers();
        }
    }, [showSharePanel]);

    const handleRemoveUser = async (userId: number) => {
        const confirm = window.confirm(t.confirmRemoveUser);
        if (confirm) {
            try {
                await axios.delete(`http://localhost:5001/api/trips/${trip?.id}/remove-user/${userId}`, { withCredentials: true });
                setSharedUsers(sharedUsers.filter((user) => user.userId !== userId));
            } catch (error) {
                console.error(t.failedToRemoveUser, error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen animate__animated animate__fadeInUp">
            <div className="container mx-auto p-6 animate__animated animate__zoomIn">
                <div className="flex justify-between items-center mb-6">
                    <div className='flex items-center gap-3'>
                        <button onClick={() => { setTripEditMode(!tripEditMode); }} className='material-symbols-outlined rounded-lg bg-primary p-2 bg-gradient-to-r from-primary to-primary-500 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:scale-105 text-white duration-150 transform'>
                            {!tripEditMode ? "edit_document" : "cancel"}
                        </button>
                        {tripEditMode && <span className='flex gap-3'>
                            <button onClick={() => updateTrip(trip!.id, newTrip)} className='material-symbols-outlined rounded-lg bg-primary p-2 bg-gradient-to-r from-primary to-primary-500 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:scale-105 text-white duration-150 transform'>
                                done
                            </button>
                        </span>}


                        <AnimatePresence mode="wait">

                            {tripEditMode ?
                                <motion.div
                                    key="1"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Input
                                        type="text"
                                        placeholder={trip?.name}
                                        value={newTrip?.name}
                                        onChange={(e) =>
                                            setNewTrip({
                                                ...newTrip!,
                                                name: (e.target.value),
                                            })
                                        }
                                    />
                                </motion.div>

                                : <motion.h1
                                    key="2"
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-3xl font-extrabold text-text"
                                >
                                    {trip?.name}
                                </motion.h1>}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => setShowAddExpense(true)}
                        className="bg-gradient-to-r from-primary to-primary-500 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:scale-105 text-white px-4 py-2 rounded-lg duration-150 transform"
                    >
                        {t.addExpense}
                    </button>


                </div>
                <div className='flex gap-3 flex-wrap justify-between'>
                    <div className='basis-2/5 grow flex flex-col'>
                        {/* {trip.image && (
                            <img
                                src={trip.image}
                                alt={trip.name}
                                className="w-full h-64 object-cover rounded-lg shadow-lg mb-3 hover:outline hover:shadow-xl hover:outline-primary duration-150"
                            />
                        )} */}
                        {trip?.image && (
                            <div className="relative w-full h-64 rounded-lg shadow-lg mb-3 hover:outline hover:shadow-xl hover:outline-primary duration-150">
                                <label
                                    htmlFor="tripImageUpload"
                                    className={`${tripEditMode ? 'cursor-pointer' : ''}`}
                                >
                                    <div className="relative w-full h-full overflow-hidden rounded-lg">
                                        <img
                                            src={trip.image}
                                            alt={trip.name}
                                            className={`w-full h-full object-cover ${tripEditMode && 'opacity-60'} transition duration-150`}
                                        />
                                        {tripEditMode && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                <span className="text-white text-2xl">✎</span>
                                            </div>
                                        )}
                                    </div>
                                </label>
                                <input
                                    disabled={!tripEditMode}
                                    id="tripImageUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                setNewTrip({ ...trip, image: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                        )}
                        <div className="flex flex-col bg-white/70 p-6 rounded-lg shadow-lg hover:outline hover:shadow-xl hover:outline-primary duration-150">
                            <div className='flex justify-between'>
                                <div className='flex flex-col'>
                                    <div className="text-text mb-4 flex items-center">
                                        <strong>{t.destination}:</strong>
                                        <AnimatePresence mode="wait">
                                            {tripEditMode ? (
                                                <motion.div
                                                    key="1"
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 30 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Input
                                                        type="text"
                                                        placeholder={trip?.destination}
                                                        value={newTrip?.destination}
                                                        onChange={(e) =>
                                                            setNewTrip({
                                                                ...newTrip!,
                                                                destination: e.target.value,
                                                            })
                                                        }
                                                    // className='h-4'
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.p
                                                    key="2"
                                                    initial={{ opacity: 0, y: -30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -30 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {trip?.destination}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="text-text mb-4 flex items-center">
                                        <strong>{t.budget}:</strong>
                                        <AnimatePresence mode="wait">
                                            {tripEditMode ? (
                                                <motion.div
                                                    key="edit-mode"
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 30 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Input
                                                        type="number"
                                                        placeholder={String(trip?.budget)}
                                                        value={newTrip?.budget}
                                                        onChange={(e) =>
                                                            setNewTrip({
                                                                ...newTrip!,
                                                                budget: Number(e.target.value),
                                                            })
                                                        }
                                                    // className='h-4'
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.p
                                                    key="display-mode"
                                                    initial={{ opacity: 0, y: -30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -30 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {trip?.budget}₪
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => setShowSharePanel(true)} className='material-symbols-outlined rounded-lg bg-primary p-2 bg-gradient-to-r from-primary to-primary-500 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:scale-105 text-white duration-150 transform'>
                                        share
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full">
                                    <div
                                        className="bg-primary rounded-full text-center max-w-full"
                                        style={{ width: `${budgetPercentage}%` }}

                                    ><p >{budgetPercentage.toFixed(1)}%</p></div>
                                </div>
                                <div className="flex justify-between mt-1 mx-1">
                                    <span className="text-sm font-medium text-text_secondary">
                                        {t.spent}: {totalSpent.toFixed(1)}₪
                                    </span>
                                    <span className="text-sm font-medium text-text_secondary">
                                        {t.remaining}: {budgetRemaining.toFixed(1)}₪
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-col lg:basis-2/4 md:basis-full sm:basis-full grow shrink ">
                        {showByDay ? <DailyExpensesBarChart expenses={expenses} /> : <ExpensesPieChart expenses={expenses} categories={categories} />}


                        <button className='bg-secondary rounded-lg py-1 shadow-lg text-white font-bold hover:bg-secondary-400 hover:shadow-xl duration-150 :scale-95' onClick={() => setShowByDay(!showByDay)}>{showByDay ? t.showByCategory : t.showByDay}</button>
                    </div>
                </div>

                <div className="mt-3 bg-white/70 p-6 rounded-lg shadow-lg hover:outline hover:shadow-xl hover:outline-primary duration-150">
                    <h1 className="text-lg font-bold text-text_secondary text-center">{t.expenses}</h1>

                    {expenses.length ? (
                        <div className="h-96 overflow-y-auto">
                            <ul className="space-y-4 mt-4">
                                {expenses.map((expense) => (
                                    <li
                                        key={expense.id}
                                        className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
                                    >
                                        {/* Left Section */}
                                        <div className="flex-1 grid divide-x-2 rtl:divide-x-reverse grid-cols-3 text-sm lg:text-base">
                                            <span className="px-2 truncate">{expense.description || t.noDescription}</span>
                                            <span className="px-2 truncate text-primary font-bold">
                                                {expense.amount}₪
                                            </span>
                                            <span className="px-2 truncate text-gray-600">
                                                {expense.categoryName}
                                            </span>
                                        </div>

                                        {/* Right Section - Buttons */}
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse relative">
                                            {/* For Large Screens */}
                                            <button
                                                onClick={() => setEditingExpense(expense)}
                                                className="hidden lg:flex items-center px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary-600 transition"
                                            >
                                                <span className="material-symbols-outlined text-sm ltr:mr-1 rtl:ml-1">edit</span>
                                                {t.edit}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExpense(expense.id)}
                                                className="hidden lg:flex items-center px-3 py-1 bg-secondary text-white text-sm rounded-lg hover:bg-secondary-600 transition"
                                            >
                                                <span className="material-symbols-outlined text-sm ltr:mr-1 rtl:ml-1">delete</span>
                                                {t.delete}
                                            </button>

                                            {/* For Small Screens */}
                                            <div className="relative lg:hidden">
                                                <button
                                                    className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                                                    onClick={() =>
                                                        setOpenMenu(openMenu === expense.id ? null : expense.id)
                                                    }
                                                >
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                                {openMenu === expense.id && (
                                                    <div
                                                        ref={menuRef}
                                                        className="absolute rtl:left-0 ltr:right-0 mt-2 bg-white shadow-lg rounded-lg z-50"
                                                    >
                                                        <button
                                                            onClick={() => setEditingExpense(expense)}
                                                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-primary flex items-center"
                                                        >
                                                            <span className="material-symbols-outlined text-sm ltr:mr-2 rtl:ml-2">
                                                                edit
                                                            </span>
                                                            {t.edit}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteExpense(expense.id)}
                                                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-secondary flex items-center"
                                                        >
                                                            <span className="material-symbols-outlined text-sm ltr:mr-2 rtl:ml-2">
                                                                delete
                                                            </span>
                                                            {t.delete}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddExpense(true)}
                            className="bg-gradient-to-r from-primary to-primary-500 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:scale-105 text-white px-6 py-2 rounded-lg duration-150 transform"
                        >
                            {t.addExpense}
                        </button>
                    )}
                </div>

                <div className='w-full text-center'>
                    <button
                        onClick={handleDeleteTrip}
                        className="bg-transparent mt-6  border-2 border-red-600 text-text px-4 py-2 rounded-lg hover:shadow-xl hover:bg-red-600 hover:text-white hover:scale-105 duration-150"
                    >
                        {t.deleteTrip}
                    </button>
                </div>


            </div>
            <FloatingWindow
                isOpen={showAddExpense}
                onClose={() => setShowAddExpense(false)}
                title={t.addExpense}
                footer={
                    <button
                        onClick={handleAddExpense}
                        className="bg-primary hover:bg-primary-400 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-150"
                    >
                        {t.add}
                    </button>
                }
            >
                <div className="space-y-4">
                    {/* Amount */}
                    <Input
                        type="number"
                        min={1}
                        placeholder={t.amount}
                        value={newExpense.amount === 0 ? "" : newExpense.amount}
                        onChange={(e) =>
                            setNewExpense({ ...newExpense, amount: Number(e.target.value) })
                        }
                    />

                    {/* Description */}
                    <Input
                        type="text"
                        placeholder={t.description}
                        value={newExpense.description}
                        onChange={(e) =>
                            setNewExpense({ ...newExpense, description: e.target.value })
                        }
                    />

                    {/* Date */}
                    <Input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) =>
                            setNewExpense({ ...newExpense, date: e.target.value })
                        }
                    />

                    {/* Categories */}
                    <select
                        value={newExpense.categoryId || categories[0]?.id}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value === -1) {
                                setShowAddCategory(true);
                            } else {
                                setNewExpense({
                                    ...newExpense,
                                    categoryId: value,
                                    categoryName: e.target.options[e.target.selectedIndex].text,
                                });
                            }
                        }}
                        className="border border-gray-300 w-full p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="-1">{t.addCategory}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </FloatingWindow>
            <FloatingWindow
                isOpen={showAddCategory}
                onClose={() => setShowAddCategory(false)}
                title={t.addCategory}
                footer={
                    <button
                        onClick={handleAddCategory}
                        className="bg-primary hover:bg-primary-400 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-150"
                    >
                        {t.add}
                    </button>
                }
            >
                <div className="space-y-4">
                    {/* Category Name */}
                    <Input
                        type="text"
                        placeholder={t.categoryName}
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                </div>
            </FloatingWindow>
            <FloatingWindow
                isOpen={!!editingExpense}
                onClose={() => setEditingExpense(null)}
                title={t.editExpense}
                footer={
                    <button
                        onClick={handleUpdateExpense}
                        className="bg-primary hover:bg-primary-400 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-150"
                    >
                        {t.update}
                    </button>
                }
            >
                <div className="space-y-4">
                    {/* Amount */}
                    <Input
                        type="number"
                        placeholder={t.amount}
                        value={editingExpense?.amount || ''}
                        onChange={(e) =>
                            setEditingExpense({
                                ...editingExpense!,
                                amount: Number(e.target.value),
                            })
                        }
                    />

                    {/* Description */}
                    <Input
                        type="text"
                        placeholder={t.description}
                        value={editingExpense?.description || ''}
                        onChange={(e) =>
                            setEditingExpense({
                                ...editingExpense!,
                                description: e.target.value,
                            })
                        }
                    />

                    {/* Date */}
                    <Input
                        type="date"
                        value={editingExpense ? formatDateForInput(editingExpense.date) : ''}
                        onChange={(e) =>
                            setEditingExpense({
                                ...editingExpense!,
                                date: e.target.value,
                            })
                        }
                    />

                    {/* Categories */}
                    <select
                        value={editingExpense?.categoryId || ''}
                        onChange={(e) =>
                            setEditingExpense({
                                ...editingExpense!,
                                categoryId: Number(e.target.value),
                            })
                        }
                        className="border border-gray-300 w-full p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </FloatingWindow>

            <FloatingWindow
                isOpen={showSharePanel}
                onClose={() => setShowSharePanel(false)}
                title={t.shareTrip}
                footer={
                    <button
                        onClick={handleShare}
                        className="bg-primary hover:bg-primary-400 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-150"
                    >
                        {t.share}
                    </button>
                }
            >
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-bold">{t.sharedWith}</h3>
                        <ul className="space-y-2">
                            {sharedUsers.map((sharedUser) => (
                                sharedUser.userId === user?._id ? (
                                    <li
                                        key={sharedUser.userId}
                                        className="flex justify-between items-center p-2 border rounded-lg shadow-sm bg-gray-100"
                                    >
                                        <span>{t.you}</span>
                                        <span className="text-sm text-gray-500">{sharedUser.role}</span>
                                    </li>
                                ) : null
                            ))}
                            {sharedUsers.map((sharedUser) => (
                                sharedUser.userId !== user?._id ? (
                                    <li
                                        key={sharedUser.userId}
                                        className="flex justify-between "
                                    >
                                        <div className="flex grow justify-between items-center p-2 border rounded-lg shadow-sm">
                                            <span>{sharedUser.email}</span>
                                            <span className="text-sm text-gray-500">{sharedUser.role}</span>
                                        </div>
                                        {sharedUser.role !== 'admin' && (
                                            <button
                                                onClick={() => handleRemoveUser(sharedUser.userId)}
                                                className="material-symbols-outlined text-red-500 hover:text-red-600"
                                            >
                                                delete
                                            </button>
                                        )}
                                    </li>
                                ) : null
                            ))}
                        </ul>
                    </div>

                    <Input
                        required
                        type="email"
                        placeholder={t.enterEmail}
                        value={newShareEmail}
                        onChange={(e) => setNewShareEmail(e.target.value)}
                    />
                </div>
            </FloatingWindow>
        </div >
    );
}
