# improveme.io Glossary

Welcome to the imio glossary! This document is meant to explain the main building blocks of the information architecture that is underlying our codebase.



## Feedback Request

A Feedback Request is the object that encompasses Feedback about a certain topic or time period. It has a title, an introductory paragraph that consists of text, and it carries a number of *Feedback Items*. The person requesting feedback from others is the *Owner* of the Feedback Request. Humans providing feedback to the *Owner* are called *Authors*. One Feedback Request can only have one *Owner*, but any number of *Authors*.



### State (Status)

A Feedback Request has different states, depending how far along it is in the process of asking for feedback and having the Authors respond. Possiblilites are:

- **`CREATING`** – The Feedback Request is a draft and has not been shared, no author has been notified. In this state, both *Feedback Items* and *Authors* can be added and removed at will by the *Owner*.

- **`REQUESTED`** – The *Owner* has requested the feedback from the *Author(s)*. This means that the Request is now visible on the *Authors*' dashboards in the "Your Contribution" section and they can start responding to the request. Once the Feedback Request is in this state, the list of Authors and *Feedback Items* is finalized and cannot be changed.

- **`AUTHORING`** – Same as **`REQUESTED`**, but at least one of the Authors has opened the Feedback Request and has started to create a *Payload* for at least one of the *Feedback Items*.

- **`PENDING`** – All *Authors* have finalized their feedback, but the Feedback has not yet been revealed to the *Owner*.

- **`DONE`** 

  

### Views

A Feedback Request has different Views associated with it, all contorlled by `src/pages/feedback/[slug].tsx`

 #### 	Presentation View

This is a ready-only view seen by an *Owner* if the state of the Feedback Request is **`REQUESTED`**, **`AUTHORING`**, **`PENDING`** or **`DONE`**. It can also be seen when the Feedback Request is **`CREATING`** as a preview.

#### Creation View

This is the view seen by an *Owner* right after creating a new Feedback Request as long as it has the state **`CREATING`**. This view contains the forms that allow the *Owner* to edit the Feedback Request.

#### Authoring View

This is the default view for Authors. They are prompted to create a *Payload* in each individual *Feedback Item* that is part of the Request. This is also used as a Preview when the Feedback request is still in the **`CREATING`** state.



### Author (User)

A User that has been asked to provide feedback.

### Owner (User)

A User that has created a Feedback Item.



### Feedback Item 

A Feedback Item is the main building block of the Feature Request. It consists of a *Prompt* and a *Payload*. This most commonly would be a question and an answer in text form, but depending on the type of the feedback item, it could theoretically be any media.

#### 	Prompt / Payload

Currently, we only have one type of Feedback Item: "Prose". This means the *Prompt* is a question (e.g. "What did I do well?") with a *Payload* of Markdown Text that has to be at least 120 characters long (half a tweet).

#### Template

A Template is a pre-defined set of *Feedback Items* that can be added directly to a *Feedback Request*. Templates are simply sets, they can be combined freely and *Feedback Items* can be subsequently removed.



## User

Technically, we have two types of Users: We have Users coming from Clerk, our authentication provider, as well as Users internally in our database. The two are mostly coupled together and there should be no distinction, yet some edge cases remain:

#### Unclaimed User

Internal users are created when a *Feedback Request* has an *Author* which is not yet a *User* in our system. Unclaimed Users are not yet associated with a Clerk ID and are identified by an e-mail address. When the owner of that e-mail address "claims" the user by registering through Clerk, *Feedback Requests* on which they are *Authors* appear on their Dashboard.

#### Dangling User

Dangling Users are *Unclaimed Users* with no *Feedback Requests* asscociated with them. This happens if a Feedback Request with an *Unclaimed User* as *Author* is created and then the Feedback Request is subsequently deleted. Once someone with the e-mail address of a Danging User signs up, they become regular Users similarly to *Unclaimed Users.*

