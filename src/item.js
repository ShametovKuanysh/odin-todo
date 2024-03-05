class Item {
    title
    description
    dueDate
    priority
    complete

    constructor(title, description, dueDate, priority){
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.complete = false
    }
}

class Project {
    _id
    title
    _items = []

    constructor(title){
        this.title = title
    }

    set id(id) {
        if (!this._id) this._id = id
    }

    get id() { return this._id }

    get items(){
        return this._items
    }
}

export { Item, Project } 