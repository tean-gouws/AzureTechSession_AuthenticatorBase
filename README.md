
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
- Navigate to: 
```
	https://westeurope.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244 
```
- Open the Person Group Accordion on the left of the page and select PUT (Create) menu item.
- Under ***Open API testing console*** click on ***West Europe***
- Enter a ***PersonGroupId*** eg. ***fbipersongroup*** and paste the copied face API key into the ***Ocp-APIm-Subscription-Key*** Textbox
- Change the ***name*** value in the Request body text area to the ***PersonGroupId***, scroll down and click ***Send***
- Navigate back to the lLogic App and paste the previously copied values into the ***API Key*** and ***Site URL*** textboxes
- Click Create
- Select the newly created person group id from the ***Person Group Id*** Dropdown
- Click on the ***Blob Name***, select the ***Expression*** tab on the popup and type ***guid()*** and click OK

 #### 11.	Create the Trigger and run the Logic App to get the Request body template
 #### 12.	Create the Trigger and run the Logic App to get the Request body template
 #### 13.	Create the Trigger and run the Logic App to get the Request body template
 #### 14.	Create the Trigger and run the Logic App to get the Request body template
 #### 15.	Create the Trigger and run the Logic App to get the Request body template
 #### 16.	Create the Trigger and run the Logic App to get the Request body template
```
Give examples
```

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
