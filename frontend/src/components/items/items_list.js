import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../dropdown/dropdown';

class ItemsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "all",
      activeDD: false
    };

    this.getActiveDD = this.getActiveDD.bind(this);
    this.setActiveDD = this.setActiveDD.bind(this);
    this.updateDD = this.updateDD.bind(this);
    this.removeActiveDD = this.removeActiveDD.bind(this);
    this.getActiveDDIcon = this.getActiveDDIcon.bind(this);
  }

  setActiveDD(type) {
    return e => {
      e.preventDefault();
      this.state.activeDD = !this.state.activeDD;
      this.setState(this.state);
    };
  }

  removeActiveDD(type) {
    return e => {
      this.state.activeDD = false;
      this.setState(this.state);
    }
  }

  getActiveDD(type) {
    return this.state.activeDD ? " active" : "";
  }

  updateDD([type, value]) {
    return e => {
      this.removeActiveDD(type);
      this.state.filter = value;
    }
  }

  getActiveDDIcon(type) {
    return this.state.activeDD ? "up" : "down";
  }

  render() {
    const { items } = this.props;
    const itemsArr = Object.values(items);
    let filteredItemsArr;

    // map to filter
    if (this.state.filter === "all"){
      filteredItemsArr = itemsArr;
    } else if (this.state.filter) {
      filteredItemsArr = [];
      itemsArr.forEach((item) => {
        if (item.category === this.state.filter) {
          filteredItemsArr.push(item);
        }
      });
    } else {
      filteredItemsArr = itemsArr;
    }

    // map to get image and label only
    filteredItemsArr = filteredItemsArr.map((item) => {
      return (
        <li key={item._id}>
          <div className="item-container list-item-container">
            <div className="item-img-wrapper list-item-img-wrapper" style={{ backgroundImage: 'url(' + item.image_url + ')' }}></div>
            <div className="item-hover-info list-item-hover-info">
              <p>{item.label}</p>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div className="items-container list-container">
        <div className="list-header">
          <h2><Link to="/items">Items</Link></h2>
          <Dropdown label="category"
            hideLabel={true}
            value={this.state.filter}
            list={["all", "hat", "top", "bottom", "shoes"]}
            getActiveDD={this.getActiveDD}
            setActiveDD={this.setActiveDD}
            updateDD={this.updateDD}
            removeActiveDD={this.removeActiveDD}
            getActiveDDIcon={this.getActiveDDIcon}
          />
        </div>
        <ul className="items list">
          <li>
            <Link className="list-item-add-wrapper" to="/items/new">
              <div className="list-item-add-inner">
                <p className="plus">+</p>
                <p className="add-text">Add New</p>
              </div>
            </Link>
          </li>
          {filteredItemsArr}
        </ul>
      </div>
    );
  }
}

export default ItemsList;