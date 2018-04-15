

# Top Secret

If you are reading this document, you have been chosen to be part of an elite team of software developers. Today the FBI needs your help on a top-secret mission. 

## Your Mission

Over the past few weeks there has been several attempts at gaining unauthorized access to our systems by attempts to crack, snoop and extort account information from our agents. 

We need you to create an alternative means of authentication on our portals. Usernames and Password does not cut it anymore, we need something much more unique. Your mission is to create an identity provider that make use of a combination of facial and voice recognition to ensure that access to our system is secure. The solution needs to be implemented using Microsoft Azure Serverless Technologies.

## Mission Overview

### Objective 1: Agent Registration and Face Training Logic App with CosmosDB

A static registration web page has already been created. This page will allow an agent to capture his/her information and then take several photos and voice recordings to train the recognition system. For your first objective you must create the required cloud services to register agents and capture their faces on Azure Cognitive Services. As time is of the essence, the best course of action will be to make use of Microsoft Azure Logic Apps.


 #### 1.	Clone the Web Project and install on local IIS 
 #### 2.	Log into the Azure Portal 
 #### 3.	Create a new Resource Group
 - Click on ***Create a Resource*** at the top right corner of the screen 
 - Search for and Select Resource Group from the list

![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wikipedia_article-creation-2.svg/260px-Wikipedia_article-creation-2.svg.png)
- Click Create
	- Enter a resource Group Name e.g. ***FBIAuthResourceGroup***
	- Select the Subscription to use
	- Set the Location to ***West Europe***
	- Click Create
- Open the Notifications menu and select ***Pin to Dashboard*** on the newly created resource
 #### 4.	Add a Storage Account to the resource group
- On the Resource Group panel on the dashboard, select ***Create Resources***
- Search for ***Storage Account*** and select ***Storage account - blob, file, table, queue***
- Click Create
- Enter a globally unique storage account name in lower case, e.g. ***fbiauthstorage***
- For the Replication option, select ***Locally Redundant Storage***
- For Resource Group – Select the ***Use Existing*** radio button and select the previously created Resource Group from the list
- Click Create

 #### 5.	Add a Cognitive Services Face API service to the Resource Group
- Click on the Resource Group panel on the Dashboard to open the Resource Group Overview page
- Click on ***+Add***, search for ***Face API***, Select Face API and click Create
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wikipedia_article-creation-2.svg/260px-Wikipedia_article-creation-2.svg.png)
- Enter a Name, e.g. ***fbiauthfaceapi***
- Select S0 for the Pricing Tier
- Under Resource Gorup – Select ***Use Existing*** radio button and select previously created resource group from the list
- Click Create
 #### 6.	Add a Logic App to the Resource Group
- Duplicate the current tab and open the Resource Group overview page
- Click ***+Add***, Search for ***Logic App***, select it and click Create
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wikipedia_article-creation-2.svg/260px-Wikipedia_article-creation-2.svg.png)
- Provide a Name and set the Location to West Europe
- Click Create
 #### 7.	Create the Trigger and run the Logic App to get the Request body template
•	Refresh the Resource Group panel on the dashboard and select the newly created Logic App
•	On the App Designer Screen, Select the trigger: ***When a HTTP request is received***
•	Click Save on the top left corner of the page, The ***HTTP POST URL*** on the HTTP Connector block will now be populated
•	Copy this value and navigate to the previous page using the breadcrumbs at the top of the page. This is the Logic App Overview screen
•	On your local machine, open the register.js file. On line 35, paste the copied URL to replace ***REGISTRATION LOGIC APP URL***
•	Open the Registration page (Register.html) on the local web application, fill out the form and click ***Capture***
•	Go back to the logic app overview page and refresh, you should now see a “Succeeded” record in the run history table at the bottom of the page. – Click on it
•	Click on the HTTP Connector to expand it. Under the output section, click on the ***Click to download*** link
•	Copy the page content, navigate back to the Overview screen using the breadcrumbs and click on the pencil (Edit) icon at the top of the page to modify the logic app
•	Click on the HTTP Connector to expand it and click on the link ***Use Sample Payload to generate schema***, click on Done. The Request body JSON Schema should now be populated
 #### 8.	Parse JSON string
- Click on ***+ New Step***, Select ***Add an Action***, search for ***Compose*** and select ***Data Operations – Compose***
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wikipedia_article-creation-2.svg/260px-Wikipedia_article-creation-2.svg.png)
- On the Compose Connector, Click on ***Add Dynamic Content*** and select the ***Expression*** tab on the popup
- In the expression, Type the following and press ***OK***: 
```
	triggerOutputs()['headers']['x-ms-meta-userdata'] 
```
- Click on ***+ New Step***, Select ***Add an Action*** and search for ***Compose***. Select ***Data Operations*** and then select ***Data Operations - Parse JSON***
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wikipedia_article-creation-2.svg/260px-Wikipedia_article-creation-2.svg.png)
- Focus on the ***Content*** input and then select the ***Output*** variable from the ***Compose*** section on the popup
- Click on the ***Use sample payload to generate schema*** link and paste the following into the popup
```
{
	"firstname": "test", 
	"surname": "test", 
	"codename": "test",
	"department": "test", 
	"email": "test" 
}
```
-  Click on ***Done***, the schema should now be populated

 #### 9.	Create Blob Storage Connector and implement
- Switch to the other Azure portal tab and click on the Storage Account on the Resource Group panel on the dashboard
- On the Cloud Storage Overview page, select ***Blobs*** in the ***Services*** section 
- On the blob service Screen, select ***+ Container***, Enter a container name e.g. ***agentfaces***
- Under Public Access Level, select ***Blob*** and click Create
- Select the previous tab to view the Logic App Design View
- Click on the top arrow between the ***HTTP*** and ***Compose*** connectors, Select ***Add a Parallel Branch*** and then ***Add an Action***
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wikipedia_article-creation-2.svg/260px-Wikipedia_article-creation-2.svg.png)
- Search for ***Blob*** and select ***Azure Blob Storage - Create blob***
- Enter any connection name, e.g. ***fbiauthconnection*** and find and select the storage account created earlier, click create
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wikipedia_article-creation-2.svg/260px-Wikipedia_article-creation-2.svg.png)
- On the Folder Path input, click on the folder icon and select the previously created container name.
- Click on the ***Blob Name***, select the ***Expression*** tab on the popup, type ***guid()*** and click OK. 
- Click on the ***Blob name*** text box again just right of the value block and type ***.png***
- Click on the ***Blob content***, select the ***Expression*** tab on the popup, type the following and click OK:
```
	 base64ToBinary(triggerBody()['$content'])
``` 
- Click Save
- To test, open the Registration web page, enter the required information and click Capture
- Navigate to the Azure Portal tab that is still on the storage account page and click on the previously created container. You should see a single record with something like ***860b32bb-2a46-4ac5-a599-0064a211edd1.png*** as file 	name.  Click on it and then click ***Download*** at the top of the page. You should see the captured image
- Open the Logic App designer tab
 #### 10.	Create Face API Person and first face
- Hover around the bottom of the ***Create Blob*** connector and click on the ***+*** icon, Select ***Add an Action***, search for face API and select ***Face API – Create a Person***
- Enter any connection name, e.g. ***fbifaceAPIconnection***
- Open the other azure tab and click on the ***Microsoft Azure*** title to navigate back to the dashboard. Select the face API Service on the Resource group panel and on the overview page select ***Keys***
- Copy the ***Key 1*** value and paste it on notepad or a sicky note
- Select ***Overview*** on the left hand menu and on the overview screen, copy the Endpoint URL and paste it on your note. This should be: 
```
	https://westeurope.API.cognitive.microsoft.com/face/v1.0.
```
- Navigate to [Cognitive Services Face API Reference](	https://westeurope.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244 )

- Open the Person Group Accordion on the left of the page and select ***PUT (Create)*** menu item.
- Under ***Open API testing console*** click on ***West Europe***
- Enter a ***PersonGroupId*** eg. ***fbipersongroup*** and paste the copied face API key into the ***Ocp-APIm-Subscription-Key*** Textbox
- Change the ***name*** value in the Request body text area to the ***PersonGroupId***, scroll down and click ***Send***
- Navigate back to the Logic App and paste the previously copied values into the ***API Key*** and ***Site URL*** Textboxes
- Click Create
- Select the newly created person group id from the ***Person Group Id*** Dropdown
- Click on the ***Blob Name***, select the ***Expression*** tab on the popup and type ***guid()*** and click OK

 #### 11.	Train the Face API with the first Face
 -	Hover around the bottom of the ***Create a Person*** connector and click on the ***+*** icon, Select ***Add an Action***, search for ***Face API*** and select ***Face API – Add a Person Face***
-	Select the previously created ***Person Group ID*** from the ***Person Group ID*** Dropdown.
-	On the other tab, re-open the storage account overview screen and then open the blob service panel. Copy the Blob service endpoint value at the top of the page.
-	Paste the endpoint address into the ***Image URL*** on the Logic App. NB Remove the last ***"\\"*** from the URL string.  While the focus is on the URL Textbox, select the ***Path*** option under the ***Create Blob*** section on the popup. 
-	Save the Logic app and open the ***Register.html*** web page to test the functionality thus far.
-	Inspect the execution details of the last run Logic App to confirm that everything succeeded.  

 #### 12.	Upload Details to Cosmos DB
 - On the Logic App designer, Click on the ***+ New Step*** link at the bottom of the page and search for ***Compose***. Select ***Data Operations – Compose***
- Rename the connector to ***Compose Document*** by using the ellipses at the top-right corner. Paste the following text into the input field:
```
{
  "id": "",
  "fullname": "",
  "codename": "",
  "department": "",
  "email": ""
}
```
- Find and place the variable blocks in the right positions based on the image below:
![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Wikipedia_article-creation-2.svg/260px-Wikipedia_article-creation-2.svg.png)
- On the other tab, navigate back to the portal dashboard and add another resource to the resource group. Search for ***Cosmos***, select ***Azure Cosmos DB*** and click ***Create*** 
- Enter a name for the account. This must be globally unique. Select ***MongoDB*** as the API and make sure the correct Subscription, Resource Group and Location has been selected. Deselect ***Geo-redundancy*** as we will not require it for this exercise, click ***Create***
- Navigate to the created Cosmos DB Resource overview page through the resource group and click on ***+ Add Collection***
- Enter a database name, e.g. ***fbiagentdetails*** and keep the ***Create New*** radio button ticked. For the collection ID, enter a collection name. e.g. ***mainagentcollection***
- Select ***Fixed 10GB*** for size and ***400*** for estimated usage, click ***Create***
- Navigate back to the logic app tab and click on ***+ New step*** at the bottom of the page. Select ***Add new Action*** and Search for Cosmos and select ***Cosmos DB – Create or Update a document***
- Enter a connection name and select the previously created Cosmos DB database, click ***Create***
- Select the Database ID, Collection ID and for the Document field, select the output variable from the ***Compose Document*** section on the popup.
- Leave the partition key empty ans select ***Yes*** for ***IsUpsert***. Save and test the web application.

### Objective 2: Create a Logic App for further face training

A Second Logic App will allow registered Agents to upload more photos and to train the Cognitive Services Face API to better recognize them in the future.   

#### 13.	Add another HTTP Triggered Logic App with to the Resource Group called     FBIFaceTraining
#### 14.	Copy the Request Body JSON Schema from the first Logic app to the second and replace “x-ms-meta-userdata” with “x-ms-meta-userid” and save the app.
#### 15.	Copy the url and paste it onto the web app – register.js line 64 
#### 16.	Once again create a blob connector and remember to use guid().png and base64ToBinary(triggerBody()['$content']) for the values.
#### 17.	Add Face API – Add a person face connector but this time, for the person ID, Add the expression:  triggerOutputs()['headers']['x-ms-meta-userid’]. Remember the imageurl is the storage account endpoint address. This can be copied from the other Logic app.
#### 18.	Finally add a request - response connector that returns the persisted face id in the response body.
#### 19.	Save the Function and test the application by pressing the capture button again. You should now be able to successfully Register agents and train the system with their faces.

### Objective 3: Create an Azure Function App for Facial Recognition

The facial recognition part will have to be done using Azure Functions as there are currently no Logic App connectors for Person Identification.

#### 20.	Create an HTTP triggered function app in Visual Studio
- Open Visual Studio 2017 and Create a new ***VisualC# -> Cloud -> Azure Function App*** called ***FBIAuthFunctions***
- Select ***Empty*** and under Storage Account Select ***None***
- On the Solution Explorer, right-click on the Project and select ***Add -> New Item***
- Select ***Azure Function*** and Name it ***IdentifyPerson.cs***
- On the NuGet package manager console type: 
  - Install-Package ***Microsoft.ProjectOxford.Face***
  - Install-Package ***Microsoft.Azure.DocumentDB***
- Open the ***local.settings.json*** file and replace the content with the following text:
```
{
  "IsEncrypted": false,
  "Values":{
    "AzureWebJobsStorage": "",
    "AzureWebJobsDashboard": "",
    "FaceApiKey": "dda76b22f5824fdfa279df7259241f3a",
    "FaceApiUrl": "https://westeurope.api.cognitive.microsoft.com/face/v1.0",
    "FaceApiPersonGroupName": "fbipersongroup",
    "CosmosDBEndpointUrl": "https://fbiauthdb.documents.azure.com:443/",
    "CosmosDBKey": "wzoaouBUYszb6aokPbiDYdPURXpm5lHtdIFV==",
    "CosmosDBDatabaseName": "fbiauthdb",
    "CosmosDBCollectionName": "agentdetail"
  },
  "Host":{
    "CORS": "*"
  }
}
```
- Enter the correct values for the ***FaceApiKey, FaceApiUrl**, etc. to the ***CosmosDBCollectionName***, these values was used in the Logic Apps and can also be found on the resources themselves. 
- Open ***IdentifyPerson.cs*** and copy the following code into it:
```
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.ProjectOxford.Face;

namespace FBIAuthFucntions
{
  public static class IdentifyPerson
  {

    private static FaceServiceClient client = new FaceServiceClient(Environment.GetEnvironmentVariable("FaceApiKey", EnvironmentVariableTarget.Process), Environment.GetEnvironmentVariable("FaceApiUrl", EnvironmentVariableTarget.Process));
    private static string PersonGroup = Environment.GetEnvironmentVariable("FaceApiPersonGroupName", EnvironmentVariableTarget.Process);

    private static DocumentClient DocClient;
    private static string EndpointUrl = Environment.GetEnvironmentVariable("CosmosDBEndpointUrl", EnvironmentVariableTarget.Process);
    private static string PrimaryKey = Environment.GetEnvironmentVariable("CosmosDBKey", EnvironmentVariableTarget.Process);
    private static string DatabaseName = Environment.GetEnvironmentVariable("CosmosDBDatabaseName", EnvironmentVariableTarget.Process);
    private static string CollectionName = Environment.GetEnvironmentVariable("CosmosDBCollectionName", EnvironmentVariableTarget.Process);


    [FunctionName("IdentifyPerson")]
    public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
    {
      log.Info("C# HTTP trigger function processed a request.");

      try
      {
        await client.TrainPersonGroupAsync(PersonGroup);
      }
      catch (Exception e)
      {
      }      DocClient = new DocumentClient(new Uri(EndpointUrl), PrimaryKey);

      using (var stream = new MemoryStream(await req.Content.ReadAsByteArrayAsync()))
      {
        var detected = await client.DetectAsync(stream);
        var identified = await client.IdentifyAsync(detected.Select(x => x.FaceId).ToArray(), PersonGroup);

        var personId = identified.OrderByDescending(x =>
            x.Candidates.OrderByDescending(y => y.Confidence).FirstOrDefault()?.Confidence ?? 0).FirstOrDefault()?
          .Candidates.OrderByDescending(y => y.Confidence).FirstOrDefault()?.PersonId;

        if (personId != null)
        {
          var personIdString = personId.ToString();
          var document = DocClient.CreateDocumentQuery<Document>(UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName))
            .Where(d => d.Id == personIdString).AsEnumerable().FirstOrDefault();

          if (document != null)
          {
            return req.CreateResponse(HttpStatusCode.OK, document.ToString());
          }
        }
      }
      return req.CreateResponse(HttpStatusCode.NotFound, "Agent not found");
    }
  }

  public class Agent
  {
    public String codename { get; set; }
    public String department { get; set; }
    public String email { get; set; }
    public String fullname { get; set; }
    public String id { get; set; }
  }
}
```
#### 21.	Test the Function
- Run the Function App
- Copy the URL from the console window and open the ***app.js*** file on your local machine and replace ***FUNCTION APP URL*** with the copied value.
- Open the ***Login.html*** page. Pressing and holding the key button will open a video capture screen and releasing it will post the photo to the newly created function. Debug the application to test if it works.   

#### 22.	Publish the Function
- Run the function app with a breakpoint to step through the code
- Copy the URL from the console window and open the app.js file on your local machine and replace FUNCTION APP URL with the copied value.
- Open the Login page, Holding the Key button will open a Video Capture Screen and releasing it will post the photo to the function. Debug the application to see if it works.   

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
