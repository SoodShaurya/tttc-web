export default function Dashboard() {
  return (
    <div>
      <div className="dashboard-grid">
        <div className="grid-item">
          <div className="database-box">
            <span>Database</span>
          </div>
        </div>
        <div className="grid-item">
          <div className="bottom-border-box">
            <span>TODAY'S TOP SYMBOL</span>
          </div>
          <div className="scrolling-text-container">
            <div className="scrolling-text" data-text="AMZN  ">
              <span>AMZN </span>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <div className="rank-box">
            <span>RANK</span>
          </div>
        </div>
      </div>

      {/* Cards grid with search box and dashed box */}
      <div className="cards-grid">
        {/* Search box */}
        <div className="card-search-container">
          <span>Search</span>
        </div>

        {/* Dashed box */}
        <div className="dashed-box-container">
        </div>

        {/* Cards */}
        {Array.from({ length: 40 }).map((_, index) => (
          <div key={index} className="card-item">Card {index + 1}</div>
        ))}
      </div>
    </div>
  );
}
