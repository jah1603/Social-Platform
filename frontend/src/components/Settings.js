import React, { Component } from "react";
import axios from 'axios';
import $ from 'jquery';
import StackedBar from './Stacked';
import Indicator from './Indicator';
import { Redirect } from 'react-router-dom'

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: this.props.password,
      login: false,
      data: {},
      min_age: this.props.data.min_age_desired,
      max_age: this.props.data.max_age_desired,
      entered_search_query: false,
      query_results: null,
      distance: this.props.data.max_distance_acceptable,
      liked_profiles: [],
      ignored_profiles: [],
      settingsUpdated: false,
      looking_for: this.props.data.looking_for,
      submitted: false
    };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleLookingForChange = this.handleLookingForChange.bind(this);
      this.handleSubmitClick = this.handleSubmitClick.bind(this);
  }

  handleChange(evt){
     this.setState({
       [evt.target.name]: parseInt(evt.target.value)
     })
  }

  handleLookingForChange(evt){
    this.setState({
      looking_for: evt.target.value
    })
  }

  handleSubmitClick(){
    this.setState({
      submitted: true
    })
  }


  approxDistanceBetweenTwoPoints(lat1, long1, lat2, long2){

    var R = 6371.0

    var lat1_rad = lat1 * (Math.PI / 180)
    var long1_rad = long1 * (Math.PI / 180)
    var lat2_rad = lat2 * (Math.PI / 180)
    var long2_rad = long2 * (Math.PI / 180)

    var dlong = long2_rad - long1_rad
    var dlat = lat2_rad - lat1_rad

    var a = Math.sin(dlat / 2)**2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlong / 2)**2
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    var distance = R * c

    return distance

  }


  handleSubmit(evt){
    evt.preventDefault();
    var self = this;
    var min_age = this.state.min_age;
    var username = this.props.loggedInAs;
    var max_age = this.state.max_age;
    // var max_distance = this.state.distance;
    var token_passed_from_main = this.props.token_to_pass_on;
    var max_distance = this.state.distance;
    var looking_for = this.state.looking_for;
    var filtering_url = `http://localhost:8080/social_reach/profiles/${this.props.loggedInAs}/?format=json`;

    const formData = new FormData();

    formData.append('min_age_desired', min_age);
    formData.append('max_age_desired', max_age);
    formData.append('max_distance_acceptable', max_distance);
    formData.append('looking_for', looking_for);

    var token_refresh_url = 'http://localhost:8080/social_reach/auth-jwt-refresh/`';

    axios.post(token_refresh_url, {'token': `${token_passed_from_main}`}).then(function(response){

    var refreshed_token = response.data['token']
    console.log("refreshed token", refreshed_token);
    axios.patch(`http://localhost:8080/social_reach/profiles/${username}/`,
      formData
   ,
 { headers: { 'Authorization': `JWT ${token_passed_from_main}` , 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' } }).then(function (response) {
    self.setState({
      settingsUpdated: true,
      submitted: false
    })
    console.log("SETTINGS UPDATED");
}).catch(function(error){
console.log(error);
console.log("Error updating settings.");
})
}).catch(function(e){
    console.log(e);
  })

      // axios.get(filtering_url)
      // .then(res =>{
      //   this.setState({
      //     entered_search_query: true,
      //     query_results: res.data,
      //   })
      // }).catch(function(error){
      //   })
  }

  total_reach(instagram_followers, twitter_followers, youtube_followers){return instagram_followers + twitter_followers + youtube_followers}

  render(){


      const getAge = require('get-age');



      if (this.state.settingsUpdated === false){
        return (

      <div className="profile">

      {/* INTRO TEXT  */}
      <fieldset>
        <legend><span class="number"></span> Hey {this.props.data.name} 👋 </legend>
        <label className="intro" type="text">We can help you find your bae! Adjust your search settings here:</label>
      </fieldset>

      <br></br>

      <div className="settings">

          <form onSubmit={this.handleSubmit}>


        {/* LIFTSTYLE CHOICES */}
        <fieldset>
          <legend><span class="number"></span> I want to see:</legend>
          <label type="text">(<i>The following choices will determine the result of your searches</i>)</label>
          <br></br>

          {/*  3 STATE TOGGLE */}
          <p>Vegans </p>
          <div class="wrapper">
            <label for="yes_radio" id="yes-lbl">👍🏻</label><input type="radio" value="" name="choice_radio"    id="yes_radio"></input>
            <label for="maybe_radio" id="maybe-lbl">🤔</label><input type="radio" value="" name="choice_radio" id="maybe_radio" checked="checked"></input>
            <label for="no_radio" id="no-lbl">👎🏻</label><input type="radio" value="" name="choice_radio" id="no_radio"></input>
            <div class="toggle"></div>
          </div>

          <p>Non-Smoker? </p>
          <div class="wrapper">
            <label for="yes_radio" id="yes-lbl">👍🏻</label><input type="radio" value="" name="choice_radio"    id="yes_radio"></input>
            <label for="maybe_radio" id="maybe-lbl">🤔</label><input type="radio" value="" name="choice_radio" id="maybe_radio" checked="checked"></input>
            <label for="no_radio" id="no-lbl">👎🏻</label><input type="radio" value="" name="choice_radio" id="no_radio"></input>
            <div class="toggle"></div>
          </div>

          <p>Gym-goer? </p>
          <div class="wrapper">
            <label for="yes_radio" id="yes-lbl">👍🏻</label><input type="radio" value="" name="choice_radio"    id="yes_radio"></input>
            <label for="maybe_radio" id="maybe-lbl">🤔</label><input type="radio" value="" name="choice_radio" id="maybe_radio" checked="checked"></input>
            <label for="no_radio" id="no-lbl">👎🏻</label><input type="radio" value="" name="choice_radio" id="no_radio"></input>
            <div class="toggle"></div>
          </div>

          <p>Has kids? </p>
          <div class="wrapper">
            <label for="yes_radio" id="yes-lbl">👍🏻</label><input type="radio" value="" name="choice_radio"    id="yes_radio"></input>
            <label for="maybe_radio" id="maybe-lbl">🤔</label><input type="radio" value="" name="choice_radio" id="maybe_radio" checked="checked"></input>
            <label for="no_radio" id="no-lbl">👎🏻</label><input type="radio" value="" name="choice_radio" id="no_radio"></input>
            <div class="toggle"></div>
          </div>

          {/* Emoji 2-state toggles NB: DO NOT DELETE AS MAY USE IN 'EDIT PAGE'*/}
            {/* <div class="emoji-toggle emoji-diet">
              <input type="checkbox" id="toggle1" class="toggle"></input>
              <div class="emoji"></div>
              <label for="toggle1" class="well"></label>
            </div>
            <div class="emoji-toggle emoji-lifestyle">
              <input type="checkbox" id="toggle2" class="toggle"></input>
              <div class="emoji"></div>
              <label for="toggle2" class="well"></label>
            </div>
            <div class="emoji-toggle emoji-passtime">
              <input type="checkbox" id="toggle3" class="toggle"></input>
              <div class="emoji"></div>
              <label for="toggle3" class="well"></label>
            </div>
            <div class="emoji-toggle emoji-rate">
              <input type="checkbox" id="toggle5" class="toggle"></input>
              <div class="emoji"></div>
              <label for="toggle5" class="well"></label>
            </div>*/}

        </fieldset>


        {/* AGE RANGE SELECTOR */}
        <fieldset>
          <legend><span class="number"></span> Age & Location </legend>
          <div>
            <p>What age range do you want to checkout? Between...</p>
              <select onChange={this.handleChange} name="min_age">
                <option disabled hidden value=''></option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
                <option value="47">47</option>
                <option value="48">48</option>
                <option value="49">49</option>
                <option value="50">50</option>
              </select><p>and</p>
              <select onChange={this.handleChange} name="max_age">
                <option disabled hidden value=''></option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
                <option value="47">47</option>
                <option value="48">48</option>
                <option value="49">49</option>
                <option value="50">50</option>
                <option value="51">51</option>
                <option value="52">52</option>
                <option value="53">53</option>
                <option value="54">54</option>
                <option value="55">55</option>
                <option value="56">56</option>
                <option value="57">57</option>
                <option value="58">58</option>
                <option value="59">59</option>
                <option value="60">60</option>
                <option value="61">61</option>
                <option value="62">62</option>
                <option value="63">63</option>
                <option value="64">64</option>
                <option value="65">65</option>
                <option value="66">66</option>
                <option value="67">67</option>
                <option value="68">68</option>
                <option value="70">70</option>
                <option value="71">71</option>
                <option selected value="72">72</option>
              </select>
            </div>
          </fieldset>

          <p>Looking for:</p>
          <select onChange={this.handleLookingForChange} name="looking_for">
            <option value="Any">Any</option>
            <option value="Girls">Girls</option>
            <option value="Guys">Guys</option>
          </select>


        {/* DISTANCE RANGE SLIDER  */}
          <fieldset>
              <p>Max Distance (1-100 kilometres):</p>
              <span> <input type="range" value={this.state.distance}  onChange={this.handleChange} max="99" min="0" step="1" name="distance"></input> </span>
              <p>Your current choice: {this.state.distance}km</p>
              <br></br><br></br>
              <input type="submit" onClick={this.handleSubmitClick} value="Update my settings"  name="fieldb" class="Save"></input>
            </fieldset>
          </form>
        </div>
      </div>

)}

else if (!this.props.loggedInAs) {return (
    <div className="center"> Oops! You need to log in </div>
  )}

else if (this.state.submitted === true){

  return(

  <Indicator />

)
}



    else
    {
      return <Redirect to='/results' data={this.props.data} loggedInAs={this.state.username} login= {true}/>

    }

                  }
                  }


export default Settings;
