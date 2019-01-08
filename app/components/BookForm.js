import Showable from './Showable.js';

class BookForm extends Showable {

    constructor(onSubmit, onError) {

        super(document.createElement('form'));
        this.el.setAttribute('id', 'book-form');
        this.el.className = 'form-container frame';
        this.el.addEventListener('submit', (e) => {
            onSubmit(e);
        });
    }

    getValues() { return {title: this.title.value, user: this.user.value, tags: this.tags.value} }

    setValues(title = '', user = '', tags = '') {

        this.title.value = title;
        this.user.value = user;
        this.tags.value = tags;
    }
    
    render() {

        this.el.innerHTML =  `

            <label for="title" class ="form-label">Title :</label>
            <input type="text" id="title" class="form-value">

            <label for="user" class ="form-label">User :</label>
            <input type="text" id="user" class="form-value">

            <label for="tags" class ="form-label">Tags :</label>
            <input type="text" id="tags" class="form-value">
 
            <input type="submit" value="Add Book" class="form-button btn-success" id="add-update-book">  
        `;

        let el = super.render();
        this.title = el.children[1];
        this.user = el.children[3];
        this.tags = el.children[5];
        return el;
    }
}

export default BookForm;