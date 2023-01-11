
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
        
        // this.ToDoListConfig = new ToDoListConfig();
        
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


Hooks.once('init', () => {
    PartySheet.initialize();
});

class TresuresSystem{
    
    //Gets all The character with a user Attached and cleans it up for me
    static GetAllPlayerCharacter() {
        //const Characters = game.users.map(user => user.character).filter(c => c).sort((a,b) => {if(a.name < b.name){return -1; } return 1});

        // -Get All users, 
        // -Map out all users that have characters
        // -filter out the empty characters
        const Characters = game.users.map(user => user.character).filter(c => c);
        
        
        //returns an array of 5e character data
        return Characters;
    }
    
   
    //Assigning Party memebers
    //Make a way to Allow Gm to only select the players characters they want to get
    //Current Party Memebers
    //Start With an Empty Roster then allow DM to Add or Deleate Actors from his list 
    //Or Click a button and Reorginze, adding all users who have an asshighned character
    static AssignPartyMembers() {
        //Get a Current List of Characters in the Party Sheet
        //Assigns a Flag to GM's that will store the Party members we are useing(We should assume the person in the menu is a GM)
        //find GM's
        CurrentGM = game.users.current
        
    }




    //Party Coins
    //  Get All Party Characters we are useing
    //  Could use a rudece function to go thru every character and add all the currencys they have
    // game.users.map(user => user.character).filter(c => c).map(user => user.system).map(user => user.currency)
    // cp
    // ep
    // gp
    // pp
    // sp
    static collectPartyCoins() {
        //Find All Player Characters(Will be changeing this once i get the character system working)
        const GetAllPlayerCharacter = this.GetAllPlayerCharacter();
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
    



    // Player items
    static AllPlayerItems() {
        //Get All Player Characters and gets all there Items
        const JumbledTogetherItems = this.GetAllPlayerCharacter().map(items => items.items);
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
            // CurrentlysortedItems = CurrentlysortedItems.flat();
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

    //Collect and Displauy All Player Items


    //Allow to Displayer Totals for how many things peaple have. 
    
    // Keep Track of whos is what
    // - Every time an item is added a Flag is Added to it called Owned by,
    //    And when we display all the items we have a section that dsiplays who owns and how many

}

class PartyMembersData{
    static getPartyMembersForUser(userId) {
        return game.users.get(userId)?.getFlag(PartySheet.ID, PartySheet.FLAGS.PSHEET);
    }
    static updateUserPartyMembers(UserId, UpdateData){
        return game.users.get(UserId)?.setFlag(PartySheet.ID, PartySheet.FLAGS.PSHEET, UpdateData)
    }
    /**
     * A single ToDo in our list of Todos.
     * @typedef {Object} partySheet
     * @property {string} id - A unique ID to identify this todo.
     * @property {string} toDoData - The text of the todo.
     * @property {boolean} isDone - Marks whether the todo is done.
     * @property {string} userId - The user's id which owns this ToDo.
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

    //allToDos
    // mapping of ToDo id to User id. Since our ToDo object has userId on it already, 
    // this could be accomplished with a big object containing all ToDos for all Users indexed by ToDo id.
    // We’ll leverage reduce for this inside a getter.
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
        //       updateToDo
        // Now that we have a way to lookup which User a particular ToDo belongs to we can make an update method that accepts only ToDo id.
    static updatePMembers(MemberId, updateData) {
        const relevantToDo = this.allPMembers[MemberId];
    
        // construct the update to send
        const update = {
          [MemberId]: updateData
        }
    
        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, update);
    }

    //Deleateing PartyMember
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