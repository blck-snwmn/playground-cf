import { GraphQLClient, gql, request } from "graphql-request";

const document = gql`
query ($accountTag: String!){
  viewer{
    accounts(filter:{
      accountTag: $accountTag
    }){
      streamMinutesViewedAdaptiveGroups(
        filter:{
          date_geq:"2023-11-01"
          date_leq:"2023-12-01"
        }
        # orderBy:[datetimeFiveMinutes_DESC]
        limit:100
      ){
        sum{
          minutesViewed
        }
        count
        dimensions{
          # date
          datetimeFiveMinutes
          # datetimeFifteenMinutes
        #   uid
        }
      }
    }
  }
}
`;
const endpoint = "https://api.cloudflare.com/client/v4/graphql";

const graphQLClient = new GraphQLClient(endpoint, {
	headers: {
		Authorization: `Bearer ${process.env.API_KEY}`,
	},
});

const resp = await graphQLClient.request(document, {
	accountTag: process.env.ACCOUNT_TAG,
});
console.log(JSON.stringify(resp, null, 2));
// console.log(resp);
