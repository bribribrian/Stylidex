import React from 'react';
import { itemImageToAWS } from '../../util/aws_util';
import { Link } from 'react-router-dom';

import ModalContainer from '../modal/modal_container';
import CollectionPreview from './collection_create_form_preview';
import Dropdown from '../dropdown/dropdown';



class EditCollectionForm extends React.Component{
  constructor(props){
    super(props);

    let collection = this.props.collection;

    this.state = {
      label: collection.label,
      hat_id: collection.hat_id,
      top_id: collection.top_id,
      bottom_id: collection.bottom_id,
      shoe_id: collection.shoe_id,
      image_url: collection.image_url,
      // imageFile: collection.imageFile,
      imageFile: null,
      user_id: this.props.currentUser.id,
      data: {
        occasion: collection.occasion,
        temperature: collection.temperature,
        precipitation: collection.precipitation
      },
      activeDD: {
        occasion: false,
        temperature: false,
        precipitation: false
      }
    };

    this.showPath = `/collections/${this.props.collectionId}`;
    this.previewImages = [];
    this.fillPreviewImages = this.fillPreviewImages.bind(this);
    this.fillPreviewImages();

    this.pickItem = this.pickItem.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleUpload = this.handleUpload.bind(this);
    this.handleImageInput = this.handleImageInput.bind(this);

    this.getActiveDD = this.getActiveDD.bind(this);
    this.setActiveDD = this.setActiveDD.bind(this);
    this.updateDD = this.updateDD.bind(this);
    this.removeActiveDD = this.removeActiveDD.bind(this);
    this.getActiveDDIcon = this.getActiveDDIcon.bind(this);
  }

  componentDidMount(){
    this.props.fetchItems();
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.updateCollection(this.state, this.props.collectionId)
      .then(res => {
        window.location.hash = `#/collections/${this.props.collectionId}`
      });
  }

  pickItem(type, id, imgUrl) {
    this.setState({[type + "_id"]: id});
    this.previewImages.push(
      <li key={id}>
        <img src={imgUrl}></img>
      </li>
    )
  }

  // ----------------------------------------------------------------------------------

  handleImageInput(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];

    reader.onloadend = () =>
      this.setState({ image_url: reader.result, imageFile: file });

    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.setState({ image_url: "", imageFile: null });
    }
  }

  handleUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    if (this.state.imageFile) {
      formData.append('image', this.state.imageFile);
    }
    // send ajax request, when we get json back, we save item (state) to the database
    itemImageToAWS(formData)
      .then(({ data }) => {
        this.setState({ image_url: data['imageUrl'] });
      });
  }

  // ----------------------------------------------------------------------------------

  clear(field, id){
    return e => {
      this.setState({[field] : null})
      for(let i = 0; i < this.previewImages.length; i++){
        let curImage = this.previewImages[i];
        if(curImage.key === id){
          this.previewImages.splice(i, 1);
        }
      }

    };
  }

  update(field){
    return e => this.setState({[field] : e.currentTarget.value});
  }

  setActiveDD(type) {
    return e => {
      e.preventDefault();
      // this.state.activeDD[type] = !this.state.activeDD[type];
      let activeDD = this.state.activeDD;
      activeDD[type] = !this.state.activeDD[type];
      this.setState(Object.assign({}, this.state, {activeDD: activeDD}));
    }
  }

  removeActiveDD(type) {
    return e => {
      // this.state.activeDD[type] = false;
      let activeDD = this.state.activeDD;
      activeDD[type] = false;
      this.setState(Object.assign({}, this.state, {activeDD: activeDD}));
    }
  }

  getActiveDD(type) {
    return this.state.activeDD[type] ? " active" : "";
  }

  updateDD([type, value]) {
    return e => {
      this.removeActiveDD(type);
      // this.state.data[type] = value;
      let data = this.state.data;
      data[type] = value;
      this.setState(Object.assign({}, this.state, {[type] : value}));
    }
  }

  getActiveDDIcon(type) {
    return this.state.activeDD[type] ? "up" : "down";
  }

  fillPreviewImages(){
    let hat = this.props.items[this.state.hat_id];
    let top = this.props.items[this.state.top_id];
    let bottom = this.props.items[this.state.bottom_id];
    let shoe = this.props.items[this.state.shoe_id];
    let articles = [hat, top, bottom, shoe];
    // articles.forEach((article) => {
    //   if(article){
    //     this.previewImages.push(
    //       <li key={article.id}>
    //         <img src={article.image_url} ></img>
    //       </li>
    //     )
    //   }
    // })

    for(let i = 0; i < articles.length; i++){
      let article = articles[i];
      if(article){
        this.previewImages.push(
          <li key={article._id}>
            <img src={article.image_url} ></img>
          </li>
        )
      }
    }
  }
  
  render(){
    const imgTag = this.state.image_url ? (
      <>
        <img src={this.state.image_url} />
      </>
    ) : null;
    return(
      <div className="collection-creation-container">
        <p>CollectionEditForm</p>
        <CollectionPreview previewImages={this.previewImages}/>
        <ModalContainer pickItem={this.pickItem} />
        <button onClick={this.props.receivePickHat}>Hat</button>
        <button onClick={this.clear('hat_id', this.state.hat_id)}>Clear Hat</button>
        <button onClick={this.props.receivePickTop}>Top</button>
        <button onClick={this.clear('top_id', this.state.top_id)}>Clear Top</button>
        <button onClick={this.props.receivePickBottom}>Bottom</button>
        <button onClick={this.clear('bottom_id', this.state.bottom_id)}>Clear Bottom</button>
        <button onClick={this.props.receivePickShoes}>Shoes</button>
        <button onClick={this.clear('shoe_id', this.state.shoe_id)}>Clear Shoes</button>
        <div>
          <form onSubmit={this.handleUpload}>
            <input type='file' onChange={this.handleImageInput}></input>
              {imgTag}
            <input type='submit'></input>
          </form>
        </div>
        <div>
          <p>Label</p>
          <input type='text' value={this.state.label} onChange={this.update('label')}></input>
        </div>
        <div className="dd-container">
          <div className="dd-bm">
            <Dropdown label="occasion"
              value={this.state.data.occasion}
              list={["casual", "formal", "semi-formal"]}
              getActiveDD={this.getActiveDD}
              setActiveDD={this.setActiveDD}
              updateDD={this.updateDD}
              removeActiveDD={this.removeActiveDD}
              getActiveDDIcon={this.getActiveDDIcon}
            />
          </div>
          <div className="dd-bm">
            <Dropdown label="temperature"
              value={this.state.data.temperature}
              list={["all", "hot", "warm", "chill", "cold"]}
              getActiveDD={this.getActiveDD}
              setActiveDD={this.setActiveDD}
              updateDD={this.updateDD}
              removeActiveDD={this.removeActiveDD}
              getActiveDDIcon={this.getActiveDDIcon}
            />
          </div>
          <div className="dd-bm">
            <Dropdown label="precipitation"
              value={this.state.data.precipitation}
              list={["sunny", "rainy", "snowy"]}
              getActiveDD={this.getActiveDD}
              setActiveDD={this.setActiveDD}
              updateDD={this.updateDD}
              removeActiveDD={this.removeActiveDD}
              getActiveDDIcon={this.getActiveDDIcon}
            />
          </div>
        </div>
        <button onClick={this.handleSubmit}>Submit</button>
      </div>

    );
  }
}

export default EditCollectionForm;