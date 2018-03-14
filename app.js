let moment = require('moment');
let longToken = "EAANXvQoQPoABABPigFN3s2gXQJG8ofYUBl1VG5cGhbAtcPLpIf9Vj2X4XXjX54HuX9O6R8YuIXfEd33OTNmv1olGRaTgak4ZABFMNDGLL5dGdNX1swzJP5DKJqdLexnROfY0cCk6ds2encasFxYeCFBPw990ZD";
let pageName = 'AirtelIndia';
let limitToMax = 100;
let sinceDate = "10/15/2014";
let untilDate = "12/15/2014";
let totalComments = 0;
let totalLikes = 0;
let totalShares = 0;
let nextData;
let postType = 'posts';
// console.log(moment().subtract(30, "d").unix());
// console.log(moment("10/15/2014 9:00", "M/D/YYYY H:mm").unix());
let sinceTimestamp = moment(sinceDate, "M/D/YYYY").unix();
let untilTimestamp = moment(untilDate, "M/D/YYYY").unix();
let papa = require('papaparse');
let fs = require('fs');
let postDetailsUrl;
let allPosts = [];
let pageUrl = `https://graph.facebook.com/${pageName}?fields=fan_count,name,rating_count,overall_star_rating&oauth_token=${longToken}`
let getAllPostsUrl = `https://graph.facebook.com/${pageName}/${postType}?since=${sinceTimestamp}&until=${untilTimestamp}&oauth_token=${longToken}&limit=${limitToMax}`
let startPartUrl = `https://graph.facebook.com/`
let endPartUrl = `?fields=comments.filter(stream).limit(0).summary(true),likes.limit(0).summary(true),shares&oauth_token=${longToken}`
let axios = require('axios');
let csvData;
let pageDetailsArray = [];
let outputObj = {
  pageName: "",
  fanCount: 0,
  ratings: 0,
  avgRating: 0,
  posts: 0,
  comments: 0,
  likes: 0,
  shares: 0
};
console.log("sinceTimestamp",sinceTimestamp);
console.log("until",untilTimestamp);
axios.get(pageUrl)
  .then(async function (response) {
    outputObj.pageName = response.data.name;
    outputObj.fanCount = response.data.fan_count;
    outputObj.ratings = response.data.rating_count;
    outputObj.avgRating = response.data.overall_star_rating;

    do {
      getAllPostsUrl = `https://graph.facebook.com/${pageName}/${postType}?since=${sinceTimestamp}&until=${untilTimestamp}&oauth_token=${longToken}&limit=${limitToMax}`;
       await axios.get(getAllPostsUrl).then(async function (res) {
        //  console.log(res.data.paging.next);
        if (res.data.paging.next) {
          nextData = true;
        }
        else { nextData = false; }
        let createdDate = res.data.data[res.data.data.length - 1].created_time;
        untilDate = moment(createdDate).format("M/D/YYYY");
        untilTimestamp = moment(untilDate, "M/D/YYYY").unix();
        let eachPost = res.data.data;
        outputObj['posts'] += eachPost.length;
        for (let i = 0; i < eachPost.length; i++) {
          postDetailsUrl = startPartUrl + eachPost[i].id + endPartUrl;
          await axios.get(postDetailsUrl).then(function (result) {
            let postInfo = {};
            if (result.data && result.data.comments && result.data.comments.summary)
              postInfo.totalComments = result.data.comments.summary.total_count;
            if (result.data && result.data.shares)
              postInfo.totalShares = result.data.shares.count;
            if (result.data && result.data.likes && result.data.likes.summary)
              postInfo.totalLikes = result.data.likes.summary.total_count;
            allPosts.push(postInfo);
          })
            .catch(function (errorPostDetail) {
              console.log(errorPostDetail);
            })
        }
        totalComments = allPosts.reduce(function (commentsSum, el) {

          return commentsSum + el.totalComments;
        }, 0);
        totalLikes = allPosts.reduce(function (likesSum, el) {

          return likesSum + el.totalLikes;
        }, 0);

        totalShares = allPosts.reduce(function (sharesSum, el) {

          return sharesSum + el.totalShares;
        }, 0);

        outputObj['comments'] += totalComments;
        outputObj['likes'] += totalLikes;
        outputObj['shares'] += totalShares;
        console.log(outputObj);

      })
        .catch(function (err) {
          console.log(err);
        })
      console.log("nextDAta: ", nextData);
    } while (nextData);
    
     pageDetailsArray[0] = outputObj;
     csvData = papa.unparse(pageDetailsArray,
      {
        header: !fs.existsSync("pageDetails.csv")
      });
     console.log("csvData: ",csvData);
    fs.appendFileSync('pageDetails.csv', csvData + "\n"); 
  })
  .catch(function (error) {
    console.log(error);
  });











