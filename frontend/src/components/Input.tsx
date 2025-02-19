import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
    return (
        <input
            className={`w-full px-4 py-2 shadow border-0 ring-gray-200 rounded-lg focus:outline-none ring-1 hover:ring-primary focus:ring-2 focus:ring-primary-400 transform ease-in-out duration-150 disabled:bg-gray-50 disabled:ring-0 rtl:text-right ltr:text-left ${className}`}
            // className={` ${className}`}
            {...props}
        />
    );
}