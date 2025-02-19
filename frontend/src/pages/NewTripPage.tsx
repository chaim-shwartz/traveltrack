import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../api/trips';
import { useLanguage } from '../context/LanguageContext';
import useTranslation from '../utils/useTranslation';
import Input from '../components/Input';

type Country = {
    name: string;
    code: string;
    nameEn: string;
};

export default function NewTripPage() {
    const navigate = useNavigate();
    const menuRef = useRef<HTMLUListElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { language } = useLanguage();
    const t = useTranslation(); // שימוש בתרגומים
    const [tripData, setTripData] = useState({
        name: '',
        budget: "",
        startDate: '',
        endDate: '',
        destination: '',
        image: '',
        countryNameEn: '',
    });

    const [countries, setCountries] = useState<Country[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [countryImage, setCountryImage] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Fetch countries
    // useEffect(() => {
    //     (async () => {
    //         axios.get(`http://api.geonames.org/countryInfoJSON?lang=${language}&username=chaim`).then((response) => {
    //             console.log(response);
    //             const countryList = response.data.geonames.map((country: any) => ({
    //                 code: country.countryCode,
    //                 name: country.countryNameEn,
    //             }));
    //             // const countryList = response.data.map((country: any) => ({
    //             //     name: country.name.common,
    //             //     nameLocal: language === 'he' && country.translations?.heb
    //             //         ? country.translations.heb.common
    //             //         : country.translations?.[language]?.common || country.name.common,
    //             //     code: country.cca2,
    //             // }))
    //             //     .sort((a, b) =>
    //             //         a.nameLocal.localeCompare(b.nameLocal, language === 'he' ? 'he' : 'en')
    //             //     );
    //             setCountries(countryList);
    //             setFilteredCountries(countryList);
    //         })
    //             .catch((error) => {
    //                 console.error('Failed to fetch countries:', error);
    //             });
    //     })()

    // }, [language]);

    useEffect(() => {
        (async () => {
            try {
                // קריאה בשפת המשתמש
                const responseLocal = await axios.get(
                    `http://api.geonames.org/countryInfoJSON?lang=${language}&username=chaim`
                );
    
                // קריאה באנגלית
                const responseEnglish = await axios.get(
                    `http://api.geonames.org/countryInfoJSON?lang=en&username=chaim`
                );
    
                // שילוב התוצאות
                const countryList = responseLocal.data.geonames.map((localCountry: any) => {
                    const englishCountry = responseEnglish.data.geonames.find(
                        (engCountry: any) => engCountry.countryCode === localCountry.countryCode
                    );
                    return {
                        code: localCountry.countryCode,
                        name: localCountry.countryName, // שם בשפה המקומית
                        nameEn: englishCountry?.countryName || localCountry.countryCode, // שם באנגלית
                    };
                });
    
                setCountries(countryList);                
                setFilteredCountries(countryList);
            } catch (error) {
                console.error('Failed to fetch countries:', error);
            }
        })();
    }, [language]);

    // Fetch image when a country is selected
    useEffect(() => {
        if (tripData.countryNameEn) {
            // setTripData({ ...tripData, destination:  })
            setIsLoading(true)
            setCountryImage(null);
            axios
                .get(`https://api.unsplash.com/search/photos`, {
                    params: { query: tripData.countryNameEn, per_page: 1 },
                    headers: {
                        Authorization: `Client-ID HvaoKKWGZkpFjA04Otf6ct_R4n6U4KC63xHB4YVIzg0`,
                    },
                })
                .then((response) => {
                    const image = response.data.results[0]?.urls?.regular || '';
                    setCountryImage(image);
                    setTripData((prev) => ({ ...prev, image: image }));
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.error('Failed to fetch country image:', error);
                    setIsLoading(false)
                });
        }
    }, [tripData.countryNameEn]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showDropdown]);


    const handleSearch = (query: string) => {        
        setTripData({ ...tripData, destination: query })
        setSearchQuery(query);
        setFilteredCountries(
            countries.filter((country) =>
                country.name.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTrip(tripData);
            navigate('/trips');
        } catch (error) {
            console.error('Failed to create trip:', error);
        }
    };

    return (
        <div className=" flex justify-center animate__animated animate__fadeInUp">
            <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-3xl hover:outline hover:outline-primary">
                <h1 className="text-2xl font-bold text-text mb-6 text-center">{t.createTrip}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-text font-medium mb-2">{t.tripName}</label>
                            <Input
                                type="text"
                                value={tripData.name}
                                onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-text font-medium mb-2">{t.budget}</label>
                            <Input
                                type="number"
                                value={tripData.budget}
                                onChange={(e) => setTripData({ ...tripData, budget: Number(e.target.value) })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-text font-medium mb-2">{t.startDate}</label>
                            <Input
                                type="date"
                                value={tripData.startDate}
                                onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-text font-medium mb-2">{t.endDate}</label>
                            <Input
                                type="date"
                                value={tripData.endDate}
                                onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    {/* <div className="relative">
                        <label className="block text-text font-medium mb-2">{t.destination}</label>
                        <Input
                            type="text"
                            value={tripData.destination || ''}
                            onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                            placeholder={t.enterDestination}
                            required
                        />
                    </div> */}
                    <div className="relative">
                        <label className="block text-text font-medium mb-2">{t.enterDestination}</label>
                        <input
                            ref={inputRef}
                            required
                            type="text"
                            placeholder={t.searchCountry}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            className="w-full px-4 py-2 shadow border rounded-lg focus:outline-none ring-0 ring-primary focus:ring-2 focus:ring-primary-400 hover:ring-1 transform ease-in-out duration-150 disabled:bg-gray-50 disabled:ring-0 rtl:text-right ltr:text-left"
                        />
                        {showDropdown && (
                            <ul ref={menuRef} className="absolute z-50 bg-white shadow-lg rounded-lg border max-h-40 overflow-y-auto mt-2 w-full">
                                {filteredCountries.map((country) => (
                                    <li
                                        key={country.code}
                                        onClick={() => {
                                            setTripData({ ...tripData, countryNameEn: country.nameEn, destination: country.name });
                                            setSearchQuery(country.name);
                                            setShowDropdown(false);
                                        }}
                                        className="p-2 hover:bg-primary-100 cursor-pointer transition"
                                    >
                                        {country.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {countryImage ? (
                        <div className="mt-4">
                            <img
                                src={countryImage}
                                alt={tripData.countryNameEn}
                                className="w-full h-48 object-cover rounded-lg shadow"
                            />
                        </div>
                    ) : (isLoading ? (
                        <div className="flex justify-center h-48 items-center">
                            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                    ) : <div>
                        {t.selectCountry}
                    </div>)
                    }
                    <div className='w-full text-center'>
                        <button
                            type="submit"
                            className="w-1/2 bg-gradient-to-r from-secondary-400 to-secondary-500 text-white py-3 rounded-lg shadow hover:shadow-lg hover:from-secondary-500 hover:scale-105 hover:to-secondary-600 duration-150 transition"
                        >
                            {t.createTrip}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
