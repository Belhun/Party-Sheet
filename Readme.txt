
Depricated to a OneNote: 
Createing a Group Inventory/ FG Party Sheet (Group Sheet?)

Major things
-Party Inventory(Allow DM to click a button and let the DM see Every Players Inventory's)
-Party Coins(Will show the Partys Total gold)

Tresure System:
    -Tresure Item:
        -Can Store Items
        -Can Store Money
    -Group Coins (When Treasure Sheet is thrown onto the party sheet all the Coins will be put here for Easy Spliting of Tresure.)
    -Group Items (When )



Party Sheet







Things i need to do before i start
-reset module.json and File structure for Module to be Group Sheet(started)
-


































This is for me to read... i think... am new ok...





Goal, This is for Learning Foundry Moudle makeing, The Goal is to make a todo list and follow this tutorial 
Notes:
Create, Read, Update, and Delete(CRUD)



questqions i need to ask about the diffrent parts of my Moudle

1. What is a (Thing)?
Kind of like this:https://hackmd.io/@akrigline/ByHFgUZ6u/%2FE6MkFOrISuSO0WunMA94rA#What-is-a-ToDo
/**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - The text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userId - The user's id which owns this ToDo.
 */



2. What do we need to be able to do with it?
Create a Table of Operations and a discription for them Like this: https://hackmd.io/@akrigline/ByHFgUZ6u/%2FE6MkFOrISuSO0WunMA94rA#What-do-we-need-to-be-able-to-do-with-it
Description -> Operation



Goal Of UI HTML injections:
1. Register a hook callback for renderPlayerList
2. Modify that second argument in the callback to include a button
3. Register a listener on that button to open a window

Making a FormApplication:
To make this we’ll need three things:

    A FormApplication subclass which gathers our data for a Template, and which handles the logic for interacting with that template.
    A handlebars template which displays the information and controls that the FormApplication gathers/handles.
    Styling, because what’s the point if it’s not pretty?

It’s easiest to work in steps, so let’s start by making a rough window which displays the current ToDos for the logged in user. We’ll get around to adding and editing them next.