import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    // Task 1: Define state variables
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const navigate = useNavigate();

    // Load all products on first render
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error:', error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2: Fetch search results from the API based on user inputs
    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search`;

        const params = new URLSearchParams();
        if (searchQuery) params.append('name', searchQuery);
        if (ageRange) params.append('age_years', ageRange);
        if (category) params.append('category', category);
        if (condition) params.append('condition', condition);

        try {
            const response = await fetch(`${baseUrl}?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    const goToDetailsPage = (productId) => {
        // Task 6: Enable navigation to the details page of a selected gift
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Category dropdown */}
                            <label htmlFor="categorySelect">Category</label>
                            <select
                                id="categorySelect"
                                className="form-control my-1"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            {/* Condition dropdown */}
                            <label htmlFor="conditionSelect">Condition</label>
                            <select
                                id="conditionSelect"
                                className="form-control my-1"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            >
                                <option value="">All</option>
                                {conditions.map((cond) => (
                                    <option key={cond} value={cond}>
                                        {cond}
                                    </option>
                                ))}
                            </select>

                            {/* Task 4: Age Range Slider */}
                            <label htmlFor="ageRange">Less than {ageRange} years</label>
                            <input
                                type="range"
                                className="form-control-range"
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Task 7: Text input for search criteria */}
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search for items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Task 8: Search button */}
                    <button className="btn btn-primary" onClick={handleSearch}>
                        Search
                    </button>

                    {/* Task 5: Display search results */}
                    <div className="search-results mt-4">
                        {searchResults.length > 0 ? (
                            searchResults.map((product) => (
                                <div key={product.id} className="card mb-3">
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="card-img-top"
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">
                                            {product.description
                                                ? `${product.description.slice(0, 100)}...`
                                                : ''}
                                        </p>
                                    </div>
                                    <div className="card-footer">
                                        <button
                                            onClick={() => goToDetailsPage(product.id)}
                                            className="btn btn-primary"
                                        >
                                            View More
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info" role="alert">
                                No products found. Please revise your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
