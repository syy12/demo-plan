import React, { useEffect, useState } from "react";
import "./App.css";
import { PlanType } from "./constants/PlanType";

function App() {
  const [plans, setPlans] = useState([]);
  const [filteredType, setFilteredType] = useState("All");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const take = 10;  // Fixed page size
  const [totalCount, setTotalCount] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchPlans = () => {
    let url = `/api/plans?skip=${skip}&take=${take}`;
    if (filteredType !== "All") {
      url += `&type=${filteredType.toLowerCase()}`;
    }

    url += `&sort=${sortOrder}`;

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(result => {
        setTotalCount(result.totalCount);  // Save total count from API
        if (skip === 0) {
          setPlans(result.data);  // Set plans for the first page
        } else {
          setPlans(prev => [...prev, ...result.data]);  // Append new plans for pagination
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Error fetching plans");
        setLoading(false);
      });
  };

  useEffect(() => {
    setSkip(0);
    fetchPlans();
  }, [filteredType, sortOrder]);

  useEffect(() => {
    if (skip !== 0) {
      fetchPlans();
    }
  }, [skip]);

  const handleViewMore = () => {
    setSkip(prev => prev + take);
  };

  const fetchPlanDetails = (id) => {
    setLoading(true);
    setError(null);
    fetch(`/api/plans/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Plan not found');
        return res.json();
      })
      .then(data => {
        setSelectedPlan(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const sortedPlans = [...plans].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="app">
      <h1>Available Plans</h1>

      <div className="filter">
        <div className="filter-left">
          <label htmlFor="plan-type-select">Filter by type:</label>
          <select
            id="plan-type-select"
            value={filteredType}
            onChange={e => {
              setFilteredType(e.target.value);
              setSkip(0);
            }}
          >
            <option value="All">All</option>
            <option value={PlanType.PREPAID}>{PlanType.PREPAID}</option>
            <option value={PlanType.POSTPAID}>{PlanType.POSTPAID}</option>
          </select>
        </div>

        <div className="filter-right">
          <label htmlFor="sort-price-select">Sort by price:</label>
          <select
            id="sort-price-select"
            value={sortOrder}
            onChange={e => {
              setSortOrder(e.target.value);
              setSkip(0);
            }}
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {loading && <div className="loader"></div>}
      {error && <div className="error">{error}</div>}

      {!loading && plans.length === 0 && (
        <p className="empty">No plans available for this type.</p>
      )}

      <div className="plans-grid">
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <p>Type: {plan.type}</p>
            <p>Price: ${plan.price}</p>
            <button onClick={() => fetchPlanDetails(plan.id)}>View Details</button>
          </div>
        ))}
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {(skip + take) < totalCount && plans.length !== 0 && !loading && (
        <button onClick={handleViewMore} className="view-more">View More</button>
      )}

      {selectedPlan && (
        <div className="modal-overlay show" onClick={() => setSelectedPlan(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{selectedPlan.name}</h2>
            <p><strong>Type:</strong> {selectedPlan.type}</p>
            <p><strong>Data Limit:</strong> {selectedPlan.dataLimit}</p>
            <p><strong>Validity:</strong> {selectedPlan.validity} days</p>
            <p><strong>Price:</strong> ${selectedPlan.price}</p>
            <p><strong>Description:</strong> {selectedPlan.description}</p>
            <button className="close-button" onClick={() => setSelectedPlan(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;