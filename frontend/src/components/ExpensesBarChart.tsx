// import React, { useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import useTranslation from '../utils/useTranslation';
// import FloatingWindow from './FloatingWindow';

// type Expense = {
//     date: string;
//     amount: number;
//     description?: string;
// };

// type Props = {
//     expenses: Expense[];
// };

// export default function DailyExpensesBarChart({ expenses }: Props) {
//     const t = useTranslation();
//     const [selectedDay, setSelectedDay] = useState<string | null>(null);
//     const [dailyExpenses, setDailyExpenses] = useState<Expense[]>([]);
//     const [isWindowOpen, setIsWindowOpen] = useState(false);
//     const [startIndex, setStartIndex] = useState(0);
//     const daysPerPage = 7;



//     const groupedExpenses = expenses.reduce((acc: Record<string, number>, expense) => {
//         const day = new Date(expense.date).toLocaleDateString();
//         acc[day] = (acc[day] || 0) + Number(expense.amount);
//         return acc;
//     }, {});

//     const labels = Object.keys(groupedExpenses);
//     const displayedLabels = labels.slice(startIndex, startIndex + daysPerPage);

//     const displayedData = Object.values(groupedExpenses).slice(
//         startIndex,
//         startIndex + daysPerPage
//     );
//     const data = {
//         labels: displayedLabels,
//         datasets: [
//             {
//                 label: t.totalExpensesPerDay,
//                 data: displayedData,
//                 backgroundColor: '#0ad273',
//                 borderColor: '#fff',
//                 borderWidth: 1,
//                 borderRadius: 5,
//             },
//         ],
//     };

//     const maxExpense = Math.max(...Object.values(groupedExpenses));
//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false,
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function (context: any) {
//                         const value = context.raw;
//                         return `${t.currencySymbol} ${Number(value).toLocaleString()}`;
//                     },
//                 },
//             },
//             datalabels: {
//                 display: true,
//                 color: '#fff', // Text color (contrast against bar color)
//                 anchor: 'center', // Anchor to the center of the bar
//                 align: 'center', // Align text inside the bar
//                 textAlign: t.isRTL ? 'right' : 'center', // Adjust text alignment for RTL
//                 formatter: function (value) {
//                     return `${t.currencySymbol} ${value.toLocaleString()}`;
//                 },
//                 padding: {
//                     top: t.isRTL ? 0 : 5, // Adjust padding for better appearance
//                 },
//                 clip: true, // Ensure labels are not drawn outside the canvas
//             },
//         },
//         layout: {
//             padding: {
//                 top: 10,
//                 bottom: 10,
//             },
//         },
//         scales: {
//             x: {
//                 title: {
//                     display: true,
//                     text: t.date,
//                     font: {
//                         size: 16,
//                     },
//                 },
//                 grid: {
//                     display: false,
//                 },
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: t.amount,
//                     font: {
//                         size: 16,
//                     },
//                 },
//                 grid: {
//                     color: '#EAEAEA',
//                 },
//                 beginAtZero: true,
//                 max: maxExpense + maxExpense * 0.2, // Add 20% padding to top of y-axis
//             },
//         },
//         onClick: (_, elements) => {
//             if (elements.length > 0) {
//                 const index = elements[0].index;
//                 const day = labels[index];
//                 const expensesForDay = expenses.filter(
//                     (expense) => new Date(expense.date).toLocaleDateString() === day
//                 );
//                 setSelectedDay(day);
//                 setDailyExpenses(expensesForDay);
//                 setIsWindowOpen(true);
//             }
//         },
//     };
//     const handleNext = () => {
//         if (startIndex + daysPerPage < labels.length) {
//             setStartIndex(startIndex + daysPerPage);
//         }
//     };

//     const handlePrevious = () => {
//         if (startIndex - daysPerPage >= 0) {
//             setStartIndex(startIndex - daysPerPage);
//         }
//     };


//     return (
//         <>
//             <div className="flex-1 flex flex-col bg-white/70 rounded-lg shadow-lg hover:outline hover:shadow-xl hover:outline-primary duration-150">
//                 <h3 className="basis-1 text-lg font-bold text-text mt-4 text-center">{t.dailyExpensesSummary}</h3>
//                 <div className="grow shrink-0 h-96 lg:h-fit sm:h-80 md:96 ">
//                     {expenses.length ? <Bar data={data} options={options} /> : <div className='h-full flex justify-center items-center'>{t.noExpenses}</div>}
//                 </div>
//                 <div className="flex justify-between mb-2">
//                     <button
//                         onClick={handleNext}
//                         disabled={startIndex + daysPerPage >= labels.length}
//                         className="text-text px-4 rounded-lg hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {t.next}
//                     </button>
//                     <button
//                         onClick={handlePrevious}
//                         disabled={startIndex === 0}
//                         className="text-text px-4 rounded-lg hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {t.previous}
//                     </button>
//                 </div>
//             </div>
//             {/* <FloatingWindow
//                 isOpen={isWindowOpen}
//                 onClose={() => setIsWindowOpen(false)}
//                 title={`${t.expenses} - ${selectedDay}`}
//             >
//                 <ul className="space-y-4">
//                     {dailyExpenses.map((expense, index) => (
//                         <li
//                             key={index}
//                             className="flex items-center justify-between p-2 border-b border-gray-200"
//                         >
//                             <span className="flex items-center space-x-2">
//                                 <span className="w-3 h-3 bg-primary rounded-full"></span>
//                                 <span className="text-text font-medium">
//                                     {expense.description || t.noDescription}
//                                 </span>
//                             </span>
//                             <span className="text-text font-bold">
//                                 {t.currencySymbol} {expense.amount.toLocaleString()}
//                             </span>
//                         </li>
//                     ))}
//                 </ul>
//             </FloatingWindow> */}
//             <FloatingWindow
//                 isOpen={isWindowOpen}
//                 onClose={() => setIsWindowOpen(false)}
//                 title={`${t.expenses} - ${selectedDay}`}
//             >
//                 <div className="space-y-4">
//                     {dailyExpenses.length > 0 ? (
//                         <ul className="space-y-4">
//                             {dailyExpenses.map((expense, index) => (
//                                 <li
//                                     key={index}
//                                     className="flex items-center justify-between p-4 border rounded-lg shadow hover:bg-gray-50 transition duration-150"
//                                 >
//                                     {/* Left: Description */}
//                                     <span className="flex items-center space-x-2 rtl:space-x-reverse">
//                                         <span className="w-3 h-3 bg-primary rounded-full"></span>
//                                         <span className="text-text font-medium">
//                                             {expense.description || t.noDescription}
//                                         </span>
//                                     </span>

//                                     {/* Right: Amount */}
//                                     <span className="text-text font-bold">
//                                         {t.currencySymbol} {expense.amount.toLocaleString()}
//                                     </span>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <div className="text-center text-text_secondary font-medium">
//                             {t.noExpenses}
//                         </div>
//                     )}
//                 </div>
//             </FloatingWindow>
//         </>
//     );
// }








import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import useTranslation from '../utils/useTranslation';
import FloatingWindow from './FloatingWindow';

type Expense = {
    date: string;
    amount: number;
    description?: string;
};

type Props = {
    expenses: Expense[];
};

export default function DailyExpensesBarChart({ expenses }: Props) {
    const t = useTranslation();
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [dailyExpenses, setDailyExpenses] = useState<Expense[]>([]);
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(0);
    const daysPerPage = 7;

    // Group expenses by day
    const groupedExpenses = expenses.reduce((acc: Record<string, number>, expense) => {
        const day = new Date(expense.date).toLocaleDateString();
        acc[day] = (acc[day] || 0) + Number(expense.amount);
        return acc;
    }, {});

    const labels = Object.keys(groupedExpenses);
    const displayedLabels = labels.slice(startIndex, startIndex + daysPerPage);

    const displayedData = Object.values(groupedExpenses).slice(
        startIndex,
        startIndex + daysPerPage
    );

    const data = {
        labels: displayedLabels,
        datasets: [
            {
                label: t.totalExpensesPerDay,
                data: displayedData,
                backgroundColor: '#5adb8f', // Primary
                borderColor: '#00a543', // Dark Primary
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: '#4ed17e', // Hover effect
            },
        ],
    };

    const maxExpense = Math.max(...Object.values(groupedExpenses));
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const value = context.raw;
                        return `${t.currencySymbol} ${Number(value).toLocaleString()}`;
                    },
                },
            },
            datalabels: {
                display: true,
                color: '#000', // White text for contrast
                anchor: 'center',
                align: 'center',
                textAlign: t.isRTL ? 'right' : 'center',
                formatter: function (value) {
                    return `${t.currencySymbol} ${value.toLocaleString()}`;
                },
                padding: {
                    top: 5, // Padding for better positioning
                },
                clip: true, // Prevent text from going outside the chart
            },
        },
        layout: {
            padding: {
                top: 20,
                bottom: 20,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: t.date,
                    font: {
                        size: 16,
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                title: {
                    display: true,
                    text: t.amount,
                    font: {
                        size: 16,
                    },
                },
                grid: {
                    color: '#EAEAEA',
                },
                beginAtZero: true,
                max: maxExpense + maxExpense * 0.2, // Add 20% padding to top of y-axis
            },
        },
        onClick: (_, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const day = labels[index];
                const expensesForDay = expenses.filter(
                    (expense) => new Date(expense.date).toLocaleDateString() === day
                );
                setSelectedDay(day);
                setDailyExpenses(expensesForDay);
                setIsWindowOpen(true);
            }
        },
    };

    const handleNext = () => {
        if (startIndex + daysPerPage < labels.length) {
            setStartIndex(startIndex + daysPerPage);
        }
    };

    const handlePrevious = () => {
        if (startIndex - daysPerPage >= 0) {
            setStartIndex(startIndex - daysPerPage);
        }
    };

    return (
        <>
            <div className="flex-1 flex flex-col bg-white/70 rounded-lg shadow-lg hover:outline hover:shadow-xl hover:outline-primary duration-150">
                <h3 className="text-lg font-bold text-text mt-4 text-center">{t.dailyExpensesSummary}</h3>
                <div className="grow shrink-0 h-96 lg:h-fit sm:h-80 md:96">
                    {expenses.length ? (
                        <Bar data={data} options={options} />
                    ) : (
                        <div className="h-full flex justify-center items-center">{t.noExpenses}</div>
                    )}
                </div>
                <div className="flex justify-between mb-4 px-4">
                    <button
                        onClick={handlePrevious}
                        disabled={startIndex === 0}
                        className="bg-secondary/80 hover:bg-secondary text-white px-4 py-2 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                    >
                        {t.previous}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={startIndex + daysPerPage >= labels.length}
                        className="bg-secondary/80 hover:bg-secondary text-white px-4 py-2 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                    >
                        {t.next}
                    </button>
                </div>
            </div>

            <FloatingWindow
                isOpen={isWindowOpen}
                onClose={() => setIsWindowOpen(false)}
                title={`${t.expenses} - ${selectedDay}`}
            >
                <div className="space-y-4">
                    {dailyExpenses.length > 0 ? (
                        <ul className="space-y-4">
                            {dailyExpenses.map((expense, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between p-4 border rounded-lg shadow hover:bg-gray-50 transition duration-150"
                                >
                                    {/* Left: Description */}
                                    <span className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <span className="w-3 h-3 bg-primary rounded-full"></span>
                                        <span className="text-text font-medium">
                                            {expense.description || t.noDescription}
                                        </span>
                                    </span>

                                    {/* Right: Amount */}
                                    <span className="text-text font-bold">
                                        {t.currencySymbol} {expense.amount.toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-text_secondary font-medium">
                            {t.noExpenses}
                        </div>
                    )}
                </div>
            </FloatingWindow>
        </>
    );
}