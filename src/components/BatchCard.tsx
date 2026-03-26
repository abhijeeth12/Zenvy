import React from 'react';
import { Users, Clock, CheckCircle } from 'lucide-react';
import './BatchCard.css';

interface BatchCardProps {
  restaurant: string;
  cuisine: string;
  participants: number;
  capacity: number;
  timeRemaining: string;
  deliveryEta: string;
  savings: string;
  isHighSuccess?: boolean;
}

const BatchCard: React.FC<BatchCardProps> = ({
  restaurant,
  cuisine,
  participants,
  capacity,
  timeRemaining,
  deliveryEta,
  savings,
  isHighSuccess = false,
}) => {
  const progressPercent = Math.min((participants / capacity) * 100, 100);

  return (
    <article className="batch-card">
      <div className="card-header">
        <div>
          <h3 className="restaurant-name">{restaurant}</h3>
          <p className="cuisine-type">{cuisine}</p>
        </div>
        {isHighSuccess && (
          <div className="success-badge">
            <CheckCircle size={14} />
            <span>High Success</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="metrics-row">
          <div className="metric">
            <Users size={16} className="metric-icon" />
            <span>{participants}/{capacity} joined</span>
          </div>
          <div className="metric">
            <Clock size={16} className="metric-icon" />
            <span>{timeRemaining} left</span>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="savings-row">
          <div className="savings-amount">
            <span className="savings-label">Est. Savings</span>
            <span className="savings-value">{savings}</span>
          </div>
          <div className="eta-block">
            <span className="eta-label">ETA</span>
            <span className="eta-value">{deliveryEta}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button className="btn-join">Join Batch</button>
      </div>
    </article>
  );
};

export default BatchCard;
