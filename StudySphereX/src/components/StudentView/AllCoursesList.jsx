import { useState, useEffect, useContext } from "react";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentViewCourseListService } from "@/services/StudentViewService";
import { filterOptions, sortOptions } from "@/config";
import { Button } from "../UI/button";
import { 
  ArrowUpDownIcon, 
  FilterIcon, 
  Clock, 
  User 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../UI/dropdown-menu"; 
import { Label } from "../UI/label"; 
import { Checkbox } from "../UI/checkbox"; 
import { useSearchParams } from "react-router-dom";


export const AllCoursesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false); 
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);

  const createSearchParamsHelper = (filterParams) => {
    const queryParams = [];
    
    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key].length > 0) {
        queryParams.push(`${key}=${filterParams[key].join(",")}`);
      }
    });

    return queryParams.join("&");
  };

  

  useEffect(() => {
    const fetchCourses = async () => {
      
      const query = createSearchParamsHelper(filters);
      
      
      
      
      const response = await fetchStudentViewCourseListService(
        `limit=10&sortBy=${sort}&${query}`
      );
      
      if (response?.success) {
        setStudentViewCoursesList(response.data);
      }
    };

    fetchCourses();
  }, [sort, filters, setStudentViewCoursesList]);
  
const handleFilterOnChange = (sectionId, option) => {
  setFilters((prev) => {
    const updated = { ...prev };
    const values = updated[sectionId] || [];

    if (values.includes(option.id)) {
      updated[sectionId] = values.filter((v) => v !== option.id);
    } else {
      updated[sectionId] = [...values, option.id];
    }

    if (updated[sectionId].length === 0) {
      delete updated[sectionId];
    }

    return updated;
  });
};

  useEffect(() => {
  const params = {};

  
  if (sort) {
    params.sortBy = sort;
  }

  
  Object.keys(filters).forEach((key) => {
    if (filters[key]?.length > 0) {
      params[key] = filters[key].join(",");
    }
  });

  params.limit = 10;

  setSearchParams(params);

  const fetchCourses = async () => {
    const response = await fetchStudentViewCourseListService(
      new URLSearchParams(params).toString()
    );

    if (response?.success) {
      setStudentViewCoursesList(response.data);
    }
  };

  fetchCourses();
}, [sort, filters]);


  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50/30">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900">All Courses</h1>
        
        <div className="flex gap-4 items-center w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <Button 
                variant="outline" 
                className="md:hidden flex-1 border-indigo-200 text-indigo-700"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
            </Button>

            {/* Sort Dropdown */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 p-5 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                <ArrowUpDownIcon className="h-4 w-4 text-indigo-600" />
                <span className="text-[16px] font-medium text-gray-700">Sort By</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white border-indigo-100">
                <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) => setSort(value)}
                >
                {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                    value={sortItem.id}
                    key={sortItem.id}
                    className="cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 focus:text-indigo-700"
                    >
                    {sortItem.label}
                    </DropdownMenuRadioItem>
                ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
            </DropdownMenu>
        <span className="font-bold  text-indigo-900 text-sm tracking-wide">{studentViewCoursesList.length} Results</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Hidden on mobile unless toggled */}
        <aside className={`
            w-full md:w-64 space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm
            ${showMobileFilters ? "block" : "hidden md:block"}
        `}>
          <div className="space-y-6">
            {Object.keys(filterOptions).map((keyItem) => (
              <div key={keyItem} className="pb-4 border-b border-gray-100 last:border-0">
                <h3 className="font-bold mb-3 text-indigo-900 text-sm tracking-wide">
                    {keyItem.toUpperCase()}
                </h3>
                <div className="grid gap-3 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label key={option.id} className="flex font-medium items-center gap-3 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors">
                      <Checkbox
                        className="border-gray-300 text-indigo-600 focus:ring-indigo-500 rounded"
                        checked={
                          filters &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content: Course Grid */}
        <main className="flex-1">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentViewCoursesList.map((course) => (
                    <div 
                        key={course._id} 
                        className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gray-200">
                            <img 
                                src={course.image} 
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-indigo-600 uppercase">
                                {course.level}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-indigo-500 uppercase tracking-wider">
                                {course.category}
                            </div>
                            
                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                                {course.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                <User className="w-4 h-4" />
                                <span>{course.instructorName}</span>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-lg font-bold text-gray-900">
                                    ${course.pricing}
                                </span>
                                <Button 
                                    variant="ghost" 
                                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 h-auto font-semibold"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-64 text-center">
                <h2 className="text-2xl font-bold text-gray-300">No Courses Found</h2>
                <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};