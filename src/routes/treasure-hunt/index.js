import { h, Component } from 'preact';
import style from './style';
import * as firebase from 'firebase';
import countries from './countries';

const mix=(e) => e.toString().replace(/,/g,' ');
const empty=(v) => !v||v.length===0;

class Info extends Component{
	state={
		show: false
	}
	
	hide(){
		this.setState({ show: false });
		this.props.that.setState({ infoMessage: null });
	}
	constructor(props){
		super(props);
		this.hide=this.hide.bind(this);
		
	}
	componentWillReceiveProps(props){
		if (!empty(props.that.state.infoMessage))
			this.setState({ show: true });
	}
	render(){
		return this.state.show?
			(<div class={mix([style.info,style[this.props.that.state.infoType]])} onClick={this.hide}>
				<i class={mix(['fa',(this.props.that.state.infoType==='success'?'fa-info-circle':'fa-exclamation-circle')])} /> {this.props.that.state.infoMessage} <i class={style.small}>(Click to disappear)</i></div>)
			:false;
	}
}

class Flag extends Component{
	
	handleClick(){
		this.props.onClick(this.props.id);
	}
	
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}
	componentWillReceiveProps(newProps){
		this.props=newProps;
	}
	render(){
		return <div onClick={this.handleClick}><i class={style.flag+' '+style[this.props.id[1]]} /> {this.props.id[0]} (+{this.props.id[2]})</div>;
	}
}

class Country extends Component{
	state={
		show: false,
		phone: ['India','in',91,'+.. .....-.....'],
		showList: false
	}
	

	handleForm(e){
		
		this.setState({ [this.props.name]: e.target.value });
		this.props.that.setState({ [this.props.name]: e.target.value });
	}
	handleISDCode(){
		this.setState({ showList: !this.state.showList });
		
	}
	setISD(e){
		this.setState({ phone: e, [this.props.name]: e[2],showList: false });
		this.props.that.setState({ [this.props.name]: this.state[this.props.name],phone: e });
	}
	constructor(props){
		super(props);
		this.handleForm=this.handleForm.bind(this);
		this.handleISDCode=this.handleISDCode.bind(this);
		this.setISD=this.setISD.bind(this);
	}
	componentWillReceiveProps(props){
		this.setState({ [this.props.name]: props.that.state[this.props.name] });
	}
	render(){
		if (empty(this.state[this.props.name]))
			this.setISD(this.state.phone);

		return (
			<div class={style.phoneInput+' '+style.f32}>
				<div class={style.selected} onClick={this.handleISDCode}>
					<i class={style.flag +' '+style[this.state.phone[1]]} /><i class="fa fa-caret-down" />+
				</div>
				
				<div>
					<input type="number" name={this.props.name} value={this.state[this.props.name]} onKeyUp={this.handleForm} />
				</div>
				{this.state.showList?
					<div class={style.countries_list+' f32'}>
						{countries.map(i =>
							<Flag id={i} onClick={this.setISD} />
						)}
					</div>
					:
					''
				}
			</div>);
	}
}


export default class Home extends Component {
	state={
		sections: [],
		phone: ['India','in',91,'+.. .....-.....'],
		phoneNumber: 91,
		teamOf: 0
	}
	getSections(course){
		this.setState({ hideSections: false });
		switch (course){
			case 'BA' : this.setState({ sections: ['A & C','B'] });break;
			case 'BBA' : this.setState({ sections: ['A','B','C','D'] });break;
			case 'BCA' : this.setState({ sections: ['A','B'] });break;
			case 'BCom' : this.setState({ sections: ['A','B','C','D','E','F'] });break;
			case 'BSc' : this.setState({ sections: ['PCM','PEM','PSM','EcSM','ECSM','PESM','SCSM','CBZ','CMZ','CMB','BCBZ','BCCZ','BCCB','BTCZ','BTCB'].sort() });break;
			case 'BVoc': this.setState({ hideSections: true,section: 'ALL' });
		}
	}
	input(event){
		let node=event.target;
		this.setState({ [node.name]: node.value });
		if (node.name==='event')
			this.getTeamCount();
		'.'.repeat(this.state.teamOf).split('').map((v,k) => {
			switch (node.name){
				case 'p'+(k+1)+'_course':
				case 'p'+(k+1)+'_year': this.getSections(this.state['p'+(k+1)+'_course']);break;
				
			}
		});
		
	}
	getTeamCount(){
		switch (this.state.event){
			case 'gaming':
			case 'it-quiz': this.setState({ teamOf: 2 });break;
			default: this.setState({ teamOf: 1 });break;
		}
	}
	add(event){
		event.preventDefault();
		
		
		if (empty(this.state.event)){
			this.setState({ infoMessage: 'Please select event' });
			return;
		}

		for (let k=0;k<this.state.teamOf;k++){
			if (empty(this.state['p'+(k+1)+'_name'])){
				this.setState({ infoMessage: 'Please enter participant '+(this.state.teamOf>1?k+1:'')+' name' });
				return;
			}
			if (empty(this.state['p'+(k+1)+'_registerNumber'])){
				this.setState({ infoMessage: 'Please enter participant '+(this.state.teamOf>1?k+1:'')+' register number' });
				return;
			}
			if (empty(this.state['p'+(k+1)+'_year'])){
				this.setState({ infoMessage: 'Please select participant '+(this.state.teamOf>1?k+1:'')+' year' });
				return;
			}
			if (empty(this.state['p'+(k+1)+'_course'])){
				this.setState({ infoMessage: 'Please select participant '+(this.state.teamOf>1?k+1:'')+' course' });
				return;
			}
			if (empty(this.state['p'+(k+1)+'_section'])){
				this.setState({ infoMessage: 'Please select participant '+(this.state.teamOf>1?k+1:'')+' section' });
				return;
			}
			if (empty(this.state['p'+(k+1)+'_phoneNumber'])||isNaN(this.state['p'+(k+1)+'_phoneNumber'])){
				this.setState({ infoMessage: 'Invalid participant '+(this.state.teamOf>1?k+1:'')+' phone number' });
				return;
			}
			if (this.state['p'+(k+1)+'_phoneNumber'].length!==this.state.phone[3].match(/\./g).length){
				this.setState({ infoMessage: 'Participant '+(this.state.teamOf>1?k+1:'')+' phone number does not appear to be from '+this.state.phone[0] });
				return;
			}
		}
		let button = document.querySelector('button');
		button.disabled=true;
		button.innerHTML='Adding...';
		let col = firebase.firestore().collection('it-week');
		
		let us1=col
			.doc(this.state.event)
			.collection('registered')
			.where('p1_registerNumber','==',this.state.p1_registerNumber)
			.onSnapshot(d => {
				if (d.empty){
					if (this.state.teamOf>1){
						let us2=col
							.doc(this.state.event)
							.collection('registered')
							.where('p1_registerNumber','==',this.state.p2_registerNumber)
							.onSnapshot(d => {
								if (d.empty){
									let us3=col
										.doc(this.state.event)
										.collection('registered')
										.where('p2_registerNumber','==',this.state.p1_registerNumber)
										.onSnapshot(d => {
											if (d.empty){
												let us4=col
													.doc(this.state.event)
													.collection('registered')
													.where('p2_registerNumber','==',this.state.p2_registerNumber)
													.onSnapshot(d => {
														if (d.empty)
															this.next1();
														else
															this.err(this.state.p2_registerNumber+' has already been registered for the event.');
														us4();
													});
											}
											else
												this.err(this.state.p1_registerNumber+' has already been registered for the event.');
											us3();
										});
								}
								else
									this.err(this.state.p2_registerNumber+' has already been registered for the event.');
								us2();
							});
					}
					else
						this.next1();
				}
				else {
					this.err(this.state.p1_registerNumber+' has already been registered for the event.');
				}
				us1();
			});
	}
	next1(){
		let col = firebase.firestore().collection('it-week');
		if (this.state.event==='coding-debugging'){
			let us2=col
				.doc('video-editing')
				.collection('registered')
				.where('p1_registerNumber','==',this.state.p1_registerNumber)
				.onSnapshot(d => {
					if (d.empty)
						this.next2();
					else
						this.err('Participants of Video Editing cannot participate in Coding & Debugging');
					us2();
				});
		}
		else if (this.state.event==='video-editing'){
			let us2 = col
				.doc('coding-debugging')
				.collection('registered')
				.where('p1_registerNumber','==',this.state.p1_registerNumber)
				.onSnapshot(d => {
					if (d.empty)
						this.next2();
					else
						this.err('Participants of Coding & Debugging cannot participate in Video Editing');
					us2();
				});
		}
		else {
			this.next2();
		}
	}
	next2(){
		let col = firebase.firestore().collection('it-week');
		let us2 = col.
			doc(this.state.event)
			.collection('registered')
			.onSnapshot(d => {
				let registeredCount = d.size;
				let us3 = col.
					doc(this.state.event).onSnapshot(d => {
						if (d.exists){
							let limit = d.data().limit;
							if (registeredCount<limit){
								let data={};
								Object.keys(this.state).map(i => i.match(/^p\d_/)?data[i]=this.state[i]:'');
								data.date=Date.now();
							
								col
									.doc(this.state.event)
									.collection('registered')
									.add(data).then(() => {
										Object.keys(data).map(i => data[i]=null);
										data.event=null;
										this.setState(data);
										this.err('Sucessfully Added');
									},e => {
										this.err('ERROR'+e.message);
									});
							}
							else {
								this.err('Limit is over. Cannot add more participant for this event.');
							}
						}
						else {
							this.err(this.state.event+' is not defined');
						}
						us3();
					});
				us2();
			});
	}
	err(text){
		let button = document.querySelector('button');
		button.innerHTML='Add';
		button.disabled=false;
		this.setState({ infoMessage: text });
	}
	constructor(props){
		super(props);
		this.input=this.input.bind(this);
		this.getSections=this.getSections.bind(this);
		this.getTeamCount=this.getTeamCount.bind(this);
		this.add = this.add.bind(this);
	}
	render() {
		return (
			<div class={style.home}>
				<h1>IT WEEK</h1>
				<div>
					Event:
					<select name="event" onchange={this.input}  value={this.state.event}>
						<option value="gaming">Gaming</option>
						<option value="web-designing">Web Designing</option>
						<option value="it-quiz">IT Quiz</option>
						<option value="photography">Photography</option>
						<option value="video-editing">Video Editing</option>
						<option value="coding-debugging">Coding & Debugging</option>
					</select>
				</div>
				{'.'.repeat(this.state.teamOf).split('').map((v,k) => (
					<div>
						<h2>Participant {this.state.teamOf>1?k+1:''} details</h2>
						<div>Enter name: <input name={'p'+(k+1)+'_name'} onchange={this.input} value={this.state['p'+(k+1)+'_name']} /></div>
						<div>Enter register number: <input type="number" name={'p'+(k+1)+'_registerNumber'} onchange={this.input} value={this.state['p'+(k+1)+'_registerNumber']} /></div>
						<div>Enter class:
							<select name={'p'+(k+1)+'_year'} value={this.state['p'+(k+1)+'_year']} onchange={this.input}>
								<option value="1">1st</option>
								<option value="2">2nd</option>
								<option value="3">3rd</option>
							</select>
							<select name={'p'+(k+1)+'_course'} onChange={this.input} value={this.state['p'+(k+1)+'_course']}>
								<option>BA</option>
								<option>BSc</option>
								<option>BCom</option>
								<option>BBA</option>
								<option>BCA</option>
								<option>BVoc</option>
							</select>
							{
								this.state.hideSections?
									'':
									<select name={'p'+(k+1)+'_section'} onchange={this.input}  value={this.state['p'+(k+1)+'_section']}>
										{
											this.state.sections.map(val => <option>{val}</option>)
										}
									</select>
							}
						</div>
						Enter phone number:
						{this.state['p'+(k+1)+'_phoneNumber']?<Country name={'p'+(k+1)+'_phoneNumber'} that={this} />:this.setState({ ['p'+(k+1)+'_phoneNumber']: ['India','in',91,'+.. .....-.....'] })}
						
					</div>))
				}
				
				<Info that={this} />
				
				<button onClick={this.add}>Add</button>

				<List event={this.state.event} teamOf={this.state.teamOf} />
			</div>
			
		);
	}
}

class List extends Component {
	componentWillReceiveProps(props){
		if (props.event)
			firebase.firestore().collection('it-week').doc(props.event).collection('registered').onSnapshot(d => {	
				this.setState({ r: d.empty?null:d.docs });
			});
		console.log(111);
	}
	render(){
		return (
			<div>
				{this.state.r?
					(this.props.teamOf>1?
						<table>
							<caption>{this.props.event }</caption>
							<tr>
								<th colspan="4">Participant 1</th>
								<th colspan="4">Participant 2</th>
							</tr>
							<tr>
								<th>Name</th>
								<th>Register Number</th>
								<th>Class</th>
								<th>Phone Number</th>
								<th>Name</th>
								<th>Register Number</th>
								<th>Class</th>
								<th>Phone Number</th>
								
							</tr>
							{this.state.r.map(i => (<tr>
								<td>{i.data().p1_name}</td>
								<td>{i.data().p1_registerNumber}</td>
								<td>{i.data().p1_year+' '+i.data().p1_course+' '+i.data().p1_section}</td>
								<td>{i.data().p1_phoneNumber}</td>
								<td>{i.data().p2_name}</td>
								<td>{i.data().p2_registerNumber}</td>
								<td>{i.data().p2_year+' '+i.data().p2_course+' '+i.data().p2_section}</td>
								<td>{i.data().p2_phoneNumber}</td>
							</tr>))}
							
						</table>:<table>
							<caption>{this.props.event }</caption>
							<tr>
								<th>Name</th>
								<th>Register Number</th>
								<th>Class</th>
								<th>Phone Number</th>
								
								
							</tr>
							{this.state.r.map(i => (<tr>
								<td>{i.data().p1_name}</td>
								<td>{i.data().p1_registerNumber}</td>
								<td>{i.data().p1_year+' '+i.data().p1_course+' '+i.data().p1_section}</td>
								<td>{i.data().p1_phoneNumber}</td>
							</tr>))}
							
						</table>)
					:
					'...'
				}
			</div>
		);
	}
}