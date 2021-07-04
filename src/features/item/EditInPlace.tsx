import React from "react";
import ContentEditable from 'react-contenteditable';


interface EditType {
    display: string,
    className?: string,
    id?: string,
    save: (value : string) => void
    
}
export default class EditInPlace extends React.Component<EditType, {editing:boolean, html:string}> {
    constructor (props: EditType) {
        super(props);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.dispatchChange = this.dispatchChange.bind(this);
        this.state = {
            editing: false,
            html: this.props.display
        }
    }
    handleFocus(evt : any) {
        this.setState({editing: true, html: this.props.display});
    }
    handleChange(evt : any) {
        this.setState({html: evt.target.value});
    }
    dispatchChange(value : string) {
        if (value && value.trim()) {
            this.props.save(value);
        }
        this.setState({editing: false});
    }
    render() {
        let shown = this.state.editing ? this.state.html : this.props.display;
        let edit = (
            /*<span onClick={ (e) => {
                this.setState({editing:true, html: this.props.display})
                
            }} >{this.props.display}</span>  
          );
        if (this.state.editing) {

            edit = (*/
                <ContentEditable
                    className={"box rounded p-1 m-1 vc d-inline-block " + (this.props.className || "")}
                    id={this.props.id}
                    html={`${shown}`}
                    spellCheck={false}
                    onFocus={(e) => {this.handleFocus(e)}}
                    onBlur={(e) => { 
                            //text content is different from innerHTML
                            this.dispatchChange(e.target.textContent!) 
                        }
                    } 
                    onChange={this.handleChange}
                    tagName='span'
                />
                );
        //}
        //Because ( ) is not JSX, do NOT put { } around edit
        //If you have a JSX component around edit, put {} around edit
        return (
            edit
        );
    }
}