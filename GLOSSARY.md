# improveme.io Glossary

Welcome to the imio glossary! This document is meant to explain the main building blocks of the information architecture that is underlying our codebase.

## Feedback Session

A Feedback Session is the object that encompasses Feedback about a certain topic or time period. It has a title, an introductory paragraph that consists of text, and it carries a number of _Feedback Items_. The person requesting feedback from others is the _Owner_ of the Feedback Session. Humans providing feedback to the _Owner_ are called _Authors_. One Feedback Session can only have one _Owner_, but any number of _Authors_.

### State (Status)

A Feedback Session has different states, depending how far along it is in the process of asking for feedback and having the Authors respond. Possiblilites are:

- **`CREATING`** – The Feedback Session is a draft and has not been shared, no author has been notified. In this state, both _Feedback Items_ and _Authors_ can be added and removed at will by the _Owner_.

- **`REQUESTED`** – The _Owner_ has requested the feedback from the _Author(s)_. This means that the Request is now visible on the _Authors_' dashboards in the "Your Contribution" section and they can start responding to the request. Once the Feedback Session is in this state, the list of *Authors* and _Feedback Items_ is finalized and cannot be changed.

- **`AUTHORING`** – Same as **`REQUESTED`**, but at least one of the Authors has opened the Feedback Session and has started to create a _Payload_ for at least one of the _Feedback Items_.

- **`PENDING`** – All _Authors_ have finalized their feedback, but the Feedback has not yet been revealed to the _Owner_.

- **`DONE`**

### Views

A Feedback Session has different Views associated with it, all contorlled by `src/pages/feedback/[slug].tsx`

#### Presentation View

This is a ready-only view seen by an _Owner_ if the state of the Feedback Session is **`REQUESTED`**, **`AUTHORING`**, **`PENDING`** or **`DONE`**. It can also be seen when the Feedback Session is **`CREATING`** as a preview.

#### Creation View

This is the view seen by an _Owner_ right after creating a new Feedback Session as long as it has the state **`CREATING`**. This view contains the forms that allow the _Owner_ to edit the Feedback Session.

#### Authoring View

This is the default view for Authors. They are prompted to create a _Payload_ in each individual _Feedback Item_ that is part of the Request. This is also used as a Preview when the Feedback Session is still in the **`CREATING`** state.

### Author (User)

A User that has been asked to provide feedback.

### Owner (User)

A User that has created a Feedback Item.

### Feedback Item

A Feedback Item is the main building block of the Feature Request. It consists of a _Prompt_ and a _Payload_. This most commonly would be a question and an answer in text form, but depending on the type of the feedback item, it could theoretically be any media.

#### Prompt / Payload

Currently, we only have one type of Feedback Item: "Prose". This means the _Prompt_ is a question (e.g. "What did I do well?") with a _Payload_ of Markdown Text that has to be at least 120 characters long (half a tweet).

#### Template

A Template is a pre-defined set of _Feedback Items_ that can be added directly to a _Feedback Session_. Templates are simply sets, they can be combined freely and _Feedback Items_ can be subsequently removed.

## User

Technically, we have two types of Users: We have Users coming from Clerk, our authentication provider, as well as Users internally in our database. The two are mostly coupled together and there should be no distinction, yet some edge cases remain:

#### Unclaimed User

Internal users are created when a _Feedback Session_ has an _Author_ which is not yet a _User_ in our system. Unclaimed Users are not yet associated with a Clerk ID and are identified by an e-mail address. When the owner of that e-mail address "claims" the user by registering through Clerk, _Feedback Sessions_ on which they are _Authors_ appear on their Dashboard.

#### Dangling User

Dangling Users are _Unclaimed Users_ with no _Feedback Sessions_ asscociated with them. This happens if a Feedback Session with an _Unclaimed User_ as _Author_ is created and then the Feedback Session is subsequently deleted. Once someone with the e-mail address of a Danging User signs up, they become regular Users similarly to _Unclaimed Users._
