
import { Link } from "react-router-dom";
import {
  Construction,
  Droplets,
  Recycle,
  Lamp,
  Waves,
  ShieldCheck
} from "lucide-react";

import "./Categories.css";

const categories = [
  {
    icon: Construction,
    title: "Roads & Potholes",
    description: "Report damaged roads, potholes and broken footpaths."
  },
  {
    icon: Droplets,
    title: "Water Supply",
    description: "Report water leakage and supply problems."
  },
  {
    icon: Recycle,
    title: "Garbage & Sanitation",
    description: "Report waste collection and cleanliness issues."
  },
  {
    icon: Lamp,
    title: "Street Lights",
    description: "Report broken street lights and dark streets."
  },
  {
    icon: Waves,
    title: "Drainage",
    description: "Report blocked drains and waterlogging."
  },
  {
    icon: ShieldCheck,
    title: "Public Safety",
    description: "Report damaged public infrastructure and safety concerns."
  }
];

function Categories() {
  return (
    <div className="categories-page">
      <section className="categories-heading">
        <span>REPORT LOCAL PROBLEMS</span>
        <h1>
          Explore <span>Categories</span>
        </h1>
        <p>
          Select a category to report an issue in your neighborhood.
        </p>
      </section>

      <section className="categories-grid">
        {categories.map((category, index) => {
          const Icon = category.icon;

          return (
            <div className="category-card" key={index}>
              <div className="category-icon">
                <Icon size={30} strokeWidth={1.8} />
              </div>

              <h3>{category.title}</h3>
              <p>{category.description}</p>

              <Link to="/report">
                Report Issue →
              </Link>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Categories;
