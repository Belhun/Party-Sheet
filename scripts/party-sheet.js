
class PartySheet {
    static ID = 'party-sheet';
    
    // static LTODOS = 'TODO-LIST';
    //FLAGS and TEMPLATES are For use thru out The Module so i dont do a typo somewhere 
    static FLAGS = {
        PSHEET: 'PSHEET'
    }
    
    static SETTINGS = {
        INJECT_BUTTON: 'inject-button'
    }

    static TEMPLATES = {
        PartySheet: `modules/${this.ID}/templates/party-sheet.hbs`
    }

    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }
    // NEED this To initialize Form Application and set Settings
    static initialize() {
        this.PartySheetConfig = new PartySheetConfig();
        
        //Settings
        // CHANGE: name and hint when Localisation changes
        game.settings.register(this.ID, this.SETTINGS.INJECT_BUTTON, {
            name: `PartySheet.settings.${this.SETTINGS.INJECT_BUTTON}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `PartySheet.settings.${this.SETTINGS.INJECT_BUTTON}.Hint`,
            onChange: () => ui.players.render()
        });
    }
}

Hooks.on('renderActorDirectory', (app, html, data) => {
    const directoryiner = html.find(`.header-actions`);


    // insert a button at the end of this element
    directoryiner.append(
        `<button class="party-sheet-icon-button"><i class="fa-thin fa-users"></i> PartySheet </button>`
    );

    //register an event listener for this button
    html.on('click', '.party-sheet-icon-button', (event) => {
        var user = game.userId;
        PartySheet.PartySheetConfig.render(true, {user});
        console.log(`${PartySheet.ID} | Button Clicked`);
    });
}); 


Hooks.once('init', () => {
    PartySheet.initialize();
});

class TresuresSystem{
    
    //Gets all The character with a user Attached and cleans it up for me
    static getAllPlayerCharacter() {
        //const Characters = game.users.map(user => user.character).filter(c => c).sort((a,b) => {if(a.name < b.name){return -1; } return 1});

        // -Get All users, 
        // -Map out all users that have characters
        // -filter out the empty characters
        const Characters = game.users.map(user => user.character).filter(c => c);
        
        
        //returns an array of 5e character data
        return Characters;
    }
    
    static getSelectedCharacter(GMId) {

        if (PartyMembersData.doseGMHavePartyMembers(GMId) == false){
            console.log(`${PartySheet.ID} | Need to Add Party Members to this GM`);
            return null;
        }

        //const Characters = game.users.map(user => user.character).filter(c => c).sort((a,b) => {if(a.name < b.name){return -1; } return 1});
        const PartyMembersForUser = PartyMembersData.getPartyMembersForUser(GMId);
        const PartyMemberEntries = Object.entries(PartyMembersForUser);
        //stores Character IDs
        var PartyMembersid = [];
        // Adds the Character ids to PartyMembers
        for (let i = 0; i < PartyMemberEntries.length; i++) {
            PartyMembersid.push(PartyMemberEntries[i][1].memberId);
        }
        // console.log(PartyMembersid);
        // -Get All Actors, 
        // -for ever PartyMemberid we find the Actor connected to the id
        // Assigns all the Characters that are found to Characters
        var Characters = []
        for (let r = 0; r < PartyMembersid.length; r++) {
            Characters.push(game.actors.find(c => c.id == PartyMembersid[r]));
        }

        
        
        
        //returns an array of 5e character data
        return Characters;
    }
   
    //Assigning Party memebers
    //Make a way to Allow Gm to only select the players characters they want to get
    //Current Party Memebers
    //Start With an Empty Roster then allow DM to Add or Deleate Actors from his list 
    //Or Click a button and Reorginze, adding all users who have an asshighned character
    




    //Party Coins
    //  Get All Party Characters we are useing
    //  Could use a rudece function to go thru every character and add all the currencys they have
    // game.users.map(user => user.character).filter(c => c).map(user => user.system).map(user => user.currency)
    // cp
    // ep
    // gp
    // pp
    // sp
    static CollectPartyCoins(GMId) {
        //Find All Player Characters(Will be changeing this once i get the character system working)
        const GetAllPlayerCharacter = this.getSelectedCharacter(GMId);
        //finds the currency of each character
        const PartyCoinsArray = GetAllPlayerCharacter.map(Characters => Characters.system).map(Systems => Systems.currency);
        // adds up all the partys 
        const TotalCurrency = PartyCoinsArray.reduce((acc, cur) => {
            const pp = acc.pp + cur.pp;
            const cp = acc.cp + cur.cp;
            const ep = acc.ep + cur.ep;
            const sp = acc.sp + cur.sp;
            const gp = acc.gp + cur.gp;
            return {pp, gp, sp, ep, cp};
        });
        TotalCurrency.individuals = GetAllPlayerCharacter.map((Characters) =>{
            const CharName = Characters.name;
            const CharId = Characters.id;
            const Money = Characters.system.currency
            const Charactersimple = {name: CharName, id: CharId, currency: Money}
            return Charactersimple;
        })
        
        return TotalCurrency;
    }
    //collect and display Total Party Coins
    


    //Collect All Player Items
    // Player items
    static CollectPartyItems(GMId) {
        //Get All Player Characters and gets all there Items
        const JumbledTogetherItems = this.getSelectedCharacter(GMId).map(items => items.items);
        //Filters Items by the Type of Items, weapons , backpack , equipment, consumable, loot.
        const AllunsortedItems =  JumbledTogetherItems.map(c => c._source).flat(1);
        const weaponsItems = AllunsortedItems.filter(item => item.type == 'weapons');
        const equipmentItems = AllunsortedItems.filter(item => item.type == 'equipment');
        const consumableItems = AllunsortedItems.filter(item => item.type == 'consumable');
        const backpackItems = AllunsortedItems.filter(item => item.type == 'backpack');
        const lootItems = AllunsortedItems.filter(item => item.type == 'loot');
        var AllItems = [weaponsItems, equipmentItems, consumableItems, backpackItems, lootItems];
        AllItems = AllItems.flat().sort((a,b) => {if(a.name < b.name){return -1; } return 1})
        // Go thu all the Items that have been sorted and Get rid of Dupicate items.
        //for every Dupicate Items Increase the quantity of the item by quantity of the dupicate.
        // should be something like quantity


        // i have a list of items and i want to reduce the items in it by dupicate items
        var CondencedItems = AllItems.reduce((acc, cur, currentIndex) => {
            var CurrentItem = cur;
            var CurrentlysortedItems = [acc];

            if (currentIndex == 0){
                return CurrentItem;
            }
            CurrentlysortedItems = CurrentlysortedItems.flat();
            // this for each loop goes over the current accumunlation of items and checks to see if there is a dupicate item.
            // if there is item that has the same Name it will increase the quantity of the item by the quantity of the dupicate item.
            for (let i = 0; i < CurrentlysortedItems.length; i++) {
                if(cur.name == CurrentlysortedItems[i].name){
                    CurrentlysortedItems[i].system.quantity = CurrentlysortedItems[i].system.quantity + cur.system.quantity;
                    return CurrentlysortedItems;
                } 
            }
            return CurrentlysortedItems = [CurrentlysortedItems, CurrentItem].flat();
                
        }, 0);
        // Add an array with the Name and ID of the Character and a Sorted List of Items they have

        return CondencedItems;
    }
}

// Party Member info,
// This data is used to store info in the GM's Flags Showing what Characters this GM wants to see in there PartySheet
class PartyMembersData{
    static doseGMHavePartyMembers(GMid){
        if (Object.entries(this.getPartyMembersForUser(GMid)).length != 0){
            // console.log(`${PartySheet.ID} | There are Party Members in this GM ID`);
            return true;
        } else {
            // console.log(`${PartySheet.ID} | There are No Party Members in this GM ID`);
            return false;
        }
    }
    static getPartyMembersForUser(userId) {
        return game.users.get(userId)?.getFlag(PartySheet.ID, PartySheet.FLAGS.PSHEET);
    }
    static updateUserPartyMembers(UserId, UpdateData){
        return game.users.get(UserId)?.setFlag(PartySheet.ID, PartySheet.FLAGS.PSHEET, UpdateData)
    }
    /**
     * A single ToDo in our list of Todos.
     * @typedef {Object} PartyMember
     * @property {string} id - A unique ID to identify this partymember in the PartySheet.
     * @property {string} GMId - the GM's Id being used.
     * @property {string} memberId - The Party Members Id Whitch can be used to find the character sheet
     */
    static createPartyMember(GMId, partMemberData) {
        // we take the User data and make a list in Flags of the users that we are going to be useing
        const Partymember = {

            id: foundry.utils.randomID(16),
            memberId: partMemberData.id,
            GMId,
        }

        // contruct the update to insert the new User
        const newPartyMember = {
            [Partymember.id]: Partymember
        }
        
        // update the database with the new Todos
        return game.users.get(GMId)?.setFlag(PartySheet.ID, PartySheet.FLAGS.PSHEET, newPartyMember);
    }
    static noAssigndPartyMembers(GMid) {
        // if there are No Characters
        if (Object.entries(this.getPartyMembersForUser(GMid)).length != 0){
            return console.log(`${PartySheet.ID} |There are Party Members in this GM id`);
        }

        var allPlayerCharacters = game.users.map(user => user.character).filter(c => c)
        for(let i = 0; i < allPlayerCharacters.length; i++) {
            this.createPartyMember(GMid, allPlayerCharacters[i])
        }
        return console.log(`${PartySheet.ID} | All Party Members Added`);
    }

    //Get allParty Members in the Gm Flags
    static get allPMembers() {
        const allPartyMembers = game.users.reduce((accumulator, user) => {
          const userTodos = this.getPartyMembersForUser(user.id);
            return {
            ...accumulator,
            ...userTodos
          }
        }, {});
        
        return allPartyMembers;
    }
    
    //Update the info in PartyMembers
    //CURENTLY NOT USED
    // static updatePMembers(MemberId, updateData) {
    //     const relevantToDo = this.allPMembers[MemberId];
    
    //     // construct the update to send
    //     const update = {
    //       [MemberId]: updateData
    //     }
    
    //     // update the database with the updated ToDo list
    //     return game.users.get(relevantToDo.userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, update);
    // }

    //Deleate Party Members from the GM's List
    static deletePMember(MemberId) {
        const relevantMember = this.allPMembers[MemberId];
        console.log(relevantMember);
        // Foundry specific syntax required to delete a key from a persisted object in the database
        const keyDeletion = {
            [`-=${MemberId}`]: null
        }
        console.log(game.userId);
        // update the database with the updated ToDo list
        return game.users.get(game.userId)?.setFlag(PartySheet.ID, PartySheet.FLAGS.PSHEET, keyDeletion);
    }
}



    //Allow to Displayer Totals for how many things peaple have. 
    
    // Keep Track of who's is what
    // - Every time an item is added a Flag is Added to it called Owned by,
    //   And when we display all the items we have a section that dsiplays who owns and how many

    
// Makeing Form Aplications
class PartySheetConfig extends FormApplication{
    static get defaultOptions() {
        const defaults = super.defaultOptions;
    
        const overrides = {
            // height: 'auto',
            id: 'party-sheet',
            template: PartySheet.TEMPLATES.PartySheet,
            title: 'Party Sheet',
            resizable: true,
            userId: game.userId, 
            closeOnSubmit: false, //Do not close when Submitted
            submitOnChange: true, // submit when any input changes
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        
        return mergedOptions;
    }
    // Grabs the ID from the options of this Form and Grabs and returns the ToDo's as 'todos'(can now be used in the hbs)
    getData(options){
        return {
            items: TresuresSystem.CollectPartyItems(options.userId),
            Coins: TresuresSystem.CollectPartyCoins(options.userId),
            Characters: TresuresSystem.getSelectedCharacter(options.userId)
        }
    }

    /* 
    When the Data from todo-list.hbs is changes in foundry it gives us data from each Variable in the form,
    we then Expand the data to give updateUserToDos and update the data. 
    */
    // async _updateObject(event, formData) {
        
    //     const expandedData = foundry.utils.expandObject(formData);
    //     ToDoList.log(true, 'saving', {
    //         formData,
    //         expandedData
    //     });
    //     await ToDoListData.updateUserToDos(this.options.userId, expandedData);

    //     this.render();
    // }

    activateListeners(html) {
        super.activateListeners(html);
    
        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }
    
    async _handleButtonClick(event) {
        // Determins what kind of event where trying to do
        const clickedElement = $(event.currentTarget);
        //The action we are trying to Do either Create of Delete
        const action = clickedElement.data().action;
        //contains the ID of the ToDo where interacting with
        const toDoId = clickedElement.parents('[data-todo-id]')?.data()?.todoId;


        switch (action) {
            case 'create' : {
                await ToDoListData.createToDo(this.options.userId);
                this.render();
                break;
            }
            case 'delete': {
                const confirmed = await Dialog.confirm({
                    // title: game.i18n.localize("TODO-LIST.confirms.deleteConfirm.Title"),
                    // content: game.i18n.localize("TODO-LIST.confirms.deleteConfirm.Content")
                    title: "Confirm Deletion",
                    content: "Are you sure you want to delete this To-Do? This action cannot be undone."
                });
                if (confirmed) {
                    await PartyMembersData.deletePMember(toDoId);
                    this.render(); 
                }
                
                break;
            }
            default: 
                ToDoList.log(true, "Got a unknown Action", {action, toDoId});
            
        }
        ToDoList.log(true, 'Button CLicked!', {action, toDoId});
    }
}