let longToken="EAANXvQoQPoABABPigFN3s2gXQJG8ofYUBl1VG5cGhbAtcPLpIf9Vj2X4XXjX54HuX9O6R8YuIXfEd33OTNmv1olGRaTgak4ZABFMNDGLL5dGdNX1swzJP5DKJqdLexnROfY0cCk6ds2encasFxYeCFBPw990ZD";
let pageName='AirtelIndia';
let limitToMax=100;
let sinceTimestamp;
let untilTimestamp;
let papa=require('papaparse');
let fs=require('fs');
// let apiUrl=`https://graph.facebook.com/${pageName}?fields=fan_count,name,rating_count,overall_star_rating,posts.limit(${limitToMax}){likes,comments,shares}&oauth_token=${longToken}`
let pageUrl=`https://graph.facebook.com/${pageName}?fields=fan_count,name,rating_count,overall_star_rating&oauth_token=${longToken}`
let postsUrl=`https://graph.facebook.com/${pageName}/posts?since=${sinceTimestamp}&until=${untilTimestamp}&oauth_token=${longToken}`
// let postDetailsUrl=`https://graph.facebook.com/${}?fields=comments.filter(stream).limit(0).summary(true),likes.limit(0).summary(true),shares&oauth_token=${longToken}`
let axios=require ('axios');
let csvData;
axios.get(pageUrl)
.then(function (response) {
//   console.log(response.data);
  /* csvData=papa.unparse(response.data);
  console.log(csvData); */
  fs.appendFileSync('pageDetails.csv',JSON.stringify(response.data));
  
})
.catch(function (error) {
  console.log(error);
});





// arr.reduce()
