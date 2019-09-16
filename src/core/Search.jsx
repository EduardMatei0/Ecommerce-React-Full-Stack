import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false
  });

  const { categories, category, search, results, searched } = data;

  // get categories from backend
  const loadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  // handle change on form
  const handleChange = name => event => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  // get data from back end
  const searchData = () => {
    if (search) {
      list({ search: search || undefined, category }).then(response => {
        if (response.error) {
          console.log(response.error);
        } else {
          setData({ ...data, results: response, searched: true });
        }
      });
    }
  };

  // submit form
  const searchSubmit = e => {
    e.preventDefault();

    searchData();
  };

  // searched messages
  const searchedMessage = (searched, results) => {
    if (searched) {
      if (results.length > 0) {
        return `Found ${results.length} products`;
      } else {
        return "No products found";
      }
    }
  };

  const searchedProducts = (results = []) => (
    <div>
      <h2 className="mt-4 mb-4">{searchedMessage(searched, results)}</h2>
      <div className="row">
        {results.map((product, i) => (
          <Card key={i} product={product} />
        ))}
      </div>
    </div>
  );

  // search form
  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <select className="btn mr-2" onChange={handleChange("category")}>
              <option value="All">All</option>
              {categories.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="search"
            className="form-control"
            onChange={handleChange("search")}
            placeholder="Search by name"
          />
        </div>
        <div className="btn input-group-append" style={{ border: "none" }}>
          <button className="input-group-text">Search</button>
        </div>
      </span>
    </form>
  );

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="row">
      <div className="container mb-3">{searchForm()}</div>
      <div className="container-fluid mb-3">{searchedProducts(results)}</div>
    </div>
  );
};

export default Search;
