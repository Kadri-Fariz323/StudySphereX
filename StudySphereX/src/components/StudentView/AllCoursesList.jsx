import { useState, useEffect, useContext } from "react";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentViewCourseListService } from "@/services/StudentViewService";
import { filterOptions, sortOptions } from "@/config";
import { Button } from "../UI/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpDownIcon, FilterIcon, User, SearchIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../UI/dropdown-menu";
import { Label } from "../UI/label";
import { Checkbox } from "../UI/checkbox";
import { useLoader } from "@/context/LoaderContext";

export const AllCoursesList = () => {
  const { setLoading } = useLoader();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const handleFilterOnChange = (sectionId, optionId, checked) => {
    setFilters((prev) => {
      const updated = { ...prev };
      const values = updated[sectionId] || [];

      if (checked) {
        updated[sectionId] = [...values, optionId];
      } else {
        updated[sectionId] = values.filter((v) => v !== optionId);
        if (updated[sectionId].length === 0) delete updated[sectionId];
      }

      return updated;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleCourseNavigate = (courseId) => {
    // Check if user is logged in (adjust 'accessToken' to your actual key name)
    const token = localStorage.getItem("accessToken"); 

    if (token) {
      // 🟢 Logged In: Go to User view (Clean UI)
      navigate(`/user/course/details/${courseId}`);
    } else {
      // ⚪ Public: Go to Public view (With Navbar)
      navigate(`/course/details/${courseId}`);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchCourses = async () => {
        const params = new URLSearchParams();

        params.set("limit", "10");
        params.set("sortBy", sort);

        if (searchQuery) params.set("search", searchQuery);

        Object.keys(filters).forEach((key) => {
          if (filters[key]?.length > 0) {
            params.set(key, filters[key].join(","));
          }
        });
        setLoading(true);
        const response = await fetchStudentViewCourseListService(
          params.toString()
        );

        if (response?.success) {
          setStudentViewCoursesList(response.data);
          setLoading(false);
        }

        setSearchParams(params);
      };

      fetchCourses();
    }, 300); // 👈 debounce delay

    return () => clearTimeout(timeout);
  }, [sort, filters, searchQuery, setStudentViewCoursesList, setSearchParams]);

  useEffect(() => {
    if (searchParams.get("search") !== searchQuery) {
      setSearchQuery(searchParams.get("search") || "");
      setSearchInput(searchParams.get("search") || "");
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50/30">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full md:w-auto max-w-md flex-1"
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              id="search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value === "") {
                  setSearchQuery("");
                }
              }}
              className="block w-full p-3 ps-9 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              placeholder="Search courses..."
            />
            <Button
              type="submit"
              className="absolute end-1.5 bottom-1.5 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded text-xs px-3 py-1.5"
            >
              Search
            </Button>
          </div>
        </form>

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
                <span className="text-[16px] font-medium text-gray-700">
                  Sort By
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[180px] bg-white border-indigo-100"
            >
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

          <span className="font-bold text-indigo-900 text-sm tracking-wide whitespace-nowrap">
            {studentViewCoursesList?.length || 0} Results
          </span>
          {localStorage.getItem("accessToken") ? (
            <button onClick={() => navigate('/user')}
              className="
            cursor-pointer font-bold transition-all 
            bg-blue-500 text-white rounded-lg 
            border-blue-600 
            
            text-xs px-3 py-1.5 border-b-[3px] 
            
            sm:text-sm sm:px-6 sm:py-2 sm:border-b-[4px]
            
            hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[4px] sm:hover:border-b-[6px]
            
            active:border-b-[1px] active:brightness-90 active:translate-y-[2px]
            
            flex-shrink-0
          "
            >
              Dashboard
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside
          className={`
            w-full md:w-64 space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm
            ${showMobileFilters ? "block" : "hidden md:block"}
        `}
        >
          <div className="space-y-6">
            {Object.keys(filterOptions).map((keyItem) => (
              <div
                key={keyItem}
                className="pb-4 border-b border-gray-100 last:border-0"
              >
                <h3 className="font-bold mb-3 text-indigo-900 text-sm tracking-wide">
                  {keyItem.toUpperCase()}
                </h3>
                A
                <div className="grid gap-3 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-3 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={!!filters?.[keyItem]?.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleFilterOnChange(keyItem, option.id, checked)
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
                 onClick={() => handleCourseNavigate(course?._id)}
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
              <h2 className="text-2xl font-bold text-gray-300">
                No Courses Found
              </h2>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
