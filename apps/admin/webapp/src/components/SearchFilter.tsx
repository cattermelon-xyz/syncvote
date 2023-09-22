import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Search from '../assets/Search.svg';
import { FilterType } from './Dashboard';


type SearchFilterProps = {
    selectedFilter: FilterType;
    setSelectedFilter: Dispatch<SetStateAction<FilterType>>;
  };
  

  function SearchFilter({ selectedFilter, setSelectedFilter }: SearchFilterProps) {

    return (
        <div className="flex justify-between items-center p-4 rounded-lg">
            <div className="relative">
                <input className="bg-black border-2 border-gray-600 p-2 pl-4 py-3 rounded-full w-72 focus:border-indigo-500 focus:outline-none text-white placeholder:text-gray-400" type="text" placeholder="Search anything..." />
                <img src={Search} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pr-2" />
            </div>

            <div className="flex intems-center">
                <p className="text-gray-500 font-medium px-4 py-2 mr-2">Statistic in</p>
                <button className={`
                    bg-black text-white rounded-full px-4 py-2 mr-2 border border-gray-600 
                    ${selectedFilter === '7 days' ? 'border-indigo-500 bg-indigo-900 font-semibold border-2' : ''}`}

                    onClick={() => setSelectedFilter('7 days')}
                >
                7 days</button>
                <button className={`
                    bg-black text-white rounded-full px-4 py-2 mr-2 border border-gray-600 
                    ${selectedFilter === '30 days' ? 'border-indigo-500 bg-indigo-900 font-semibold border-2' : ''}`}

                    onClick={() => setSelectedFilter('30 days')}
                >
                30 days</button>
                <button className={`
                    bg-black text-white rounded-full px-4 py-2 mr-2 border border-gray-600 
                    ${selectedFilter === '90 days' ? 'border-indigo-500 bg-indigo-900 font-semibold border-2' : ''}`}

                    onClick={() => setSelectedFilter('90 days')}
                >
                90 days</button>
                <button className={`
                    bg-black text-white rounded-full px-4 py-2 mr-2 border border-gray-600 
                    ${selectedFilter === 'All' ? 'border-indigo-500 bg-indigo-900 font-semibold border-2' : ''}`}

                    onClick={() => setSelectedFilter('All')}
                >
                All </button>
               
            </div>
        </div>
    );
}

export default SearchFilter;
