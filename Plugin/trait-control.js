TraitControl = {

    addUnitTrait: function(unit, id) {
        if (unit.custom.trait!=null) {
            unit.custom.trait.push(id);
        }
        else {
            unit.custom.trait = [id];
        }
    },

    addEventTrait: function(id) {
        unit = root.getEventCommandObject().getOriginalContent().getUnit();
        this.addUnitTrait(unit, id);
    },

    //We assume that the traits are ordered in a way that the first trait has ID 0, the second ID 1, and so on.
    getTrait: function(id) {
        return root.getMetaSession().global.traitList[id];
    },

    getTraitsArray: function(unit, ignoreWeapon) {
        var traitArray = [];
        var i;

        //The traitArray starts empty, so we insert all the traits from the unit without checking for duplicates    
        var auxArray = unit.custom.trait!=null ? unit.custom.trait : [];
        for (i=0; i<auxArray.length; i++) {
            traitArray.push(auxArray[i]);
        }

        //Traits of the class
        var unitClass = unit.getClass();
        auxArray = unitClass.custom.trait!=null ? unitClass.custom.trait : [];
        for (i=0; i<auxArray.length; i++) {
            if (!this._isRepeated(traitArray, auxArray[i])) {
                traitArray.push(auxArray[i]);
            }
        }

        //Traits of the states
        var turnStateList = unit.getTurnStateList();
        var state;
        for (j=0; j<turnStateList.getCount(); j++) {
            state = turnStateList.getData(j).getState();
            auxArray = state.custom.trait!=null ? state.custom.trait : [];
            for (i=0; i<auxArray.length; i++) {
                if (!this._isRepeated(traitArray, auxArray[i])) {
                    traitArray.push(auxArray[i]);
                }
            }
        }

        //Traits of the weapon
        if (!ignoreWeapon) {
            var weapon = ItemControl.getEquippedWeapon(unit);
            if (weapon!=null) {
                auxArray = weapon.custom.trait!=null ? weapon.custom.trait : [];
                for (i=0; i<auxArray.length; i++) {
                    if (!this._isRepeated(traitArray, auxArray[i])) {
                        traitArray.push(auxArray[i]);
                    }
                }
            }
        }
                
        //Traits of the inventory
        var j, item, reqArray, hasReq, h;
        var inventory = [];
        var itemCount = UnitItemControl.getPossessionItemCount(unit);

        for (i=0; i<itemCount; i++) {
            inventory.push(UnitItemControl.getItem(unit, i));
        }
        j = 0;
        while (j<inventory.length) {
            item = inventory[j];
            hasReq = iu.call(ItemControl, unit, item) //ItemControl.isItemUsable(unit, item) == iu.call(ItemControl, unit, item)
            //We have to make sure that this part calls the default function and not the custom one to avoid an infinite loop.
            if (hasReq) { 
                auxArray = item.custom.trait!=null ? item.custom.trait : [];
                reqArray = item.custom.userTrait!=null ? item.custom.userTrait : [];

                h = 0;
                while (hasReq && h<reqArray.length) {
                    hasReq = this._isRepeated(traitArray, reqArray[h]); //We check that the unit has the traits required by the itm
                    h++;
                }
            }

            if (hasReq) {
                for (i=0; i<auxArray.length; i++) {
                    if (!this._isRepeated(traitArray, auxArray[i])) {
                        traitArray.push(auxArray[i]);
                    }
                }
                inventory.splice(j, 1);
                j = 0;  
            }
            else {
                j++;
            }
            
        }

        return traitArray;
    },

    //True if the active unit has a skill effective againts the passive unit or if the weapon is effective against the passive unit
    isEffective: function(active, passive, weapon) {
        var effective = false;        
        var weaponTraits = weapon.custom.effTrait!=null ? weapon.custom.effTrait : [];
        var skillArray = SkillControl.getSkillMixArray(active, weapon, -1, ''); //Skills of the active unit
        var passiveTraits = this.getTraitsArray(passive, false);                //Skills of the passive unit
        var i = 0;
        var j = 0;
        //Check if the weapon is effective against the passive unit
        while (i<passiveTraits.length && !effective) {
            while (j<weaponTraits.length && !effective) {
                effective = passiveTraits[i] == weaponTraits[j];
                j++;
            }
            i++;
        }

        //Check if some of the skills of the active unit are effective against the passive unit
        var skillTraits;
        i = 0;
        j = 0;
        var h = 0;
        while (h<skillArray.length && !effective) {            
            skillTraits = skillArray[i].skill.custom.effTrait!=null ? skillArray[i].skill.custom.effTrait : [];   
            while (i<passiveTraits.length && !effective) {     
                while (j<skillTraits.length && !effective) {    
                    effective = passiveTraits[i] == skillTraits[j];
                    j++;
                }
                i++;
            }
            h++;
        }

        return effective;
    },

    //True if the unit can equip/use the item
    canUse: function(unit, item) {
        var usable = true;
        var unitTraits = this.getTraitsArray(unit, item.isWeapon());
        var itemTraits = item.custom.userTrait!=null ? item.custom.userTrait : [];
        var i = 0;
        var j, found;

        while (i<itemTraits.length && usable) {
            found = false;
            j = 0;
            while(j<unitTraits.length && !found) {
                found = itemTraits[i] == unitTraits[j];
                j++;
            }
            usable = found;
            i++;
        }

        return usable;
    },

    //True if the unit has the required traits to change to the class.
    //This implies that the unit has the required traits of at least one array of traits.
    //Also, it can't have any of the traits on the notTraits array
    //For example, {reqTraits:[[Lawful, Noble], [Good]], not:[Evil]}
    //This means that the unit can change to that class if it has the traits Lawful and Noble, or if it has the trait Good. Also, it can't have the trait Evil.
    canChange: function(unit, cls) {
        var unitTraits = this.getTraitsArray(unit, false);
        var reqTraits = cls.custom.changeTrait!=null ? cls.custom.changeTrait : []; //Array of arrays of traits. The unit must have at least the traits on one of those arrays
        var notTraits = reqTraits.not!=null ? reqTraits.not : [];   //Array of traits. The unit must not have any traits of this array
        var change = reqTraits.length==0; //change starts as true if there are not any requirements
        var i = 0;
        var j = 0;
        var aux = true;

        //The unit must have at least the traits on one of those arrays
        while (i<reqTraits.length && !change) {
            while (j<reqTraits[i].length && aux) {
                aux = this._isRepeated(unitTraits, reqTraits[i][j]);
                j++;
            }
            change = aux;
            i++;
        }

        i = 0;
        //The unit must not have any traits of this array
        while (i<notTraits.length && change) {
            change = !this._isRepeated(unitTraits, notTraits[i]);
            i++;
        }

        return change;
    },

    hasTrait: function(unit, trait) {
        unitTraits = this.getTraitsArray(unit, false);
        return (this._isRepeated(unitTraits, trait));
    },

    //True if the trait is inside the array
    _isRepeated: function(array, trait) {
        var i = 0;
        var found = false;

        while (i<array.length && !found) {
            found = array[i]==trait;
            i++;
        }

        return found;
    }
};

//Skills and weapons can have effective damage against traits
var eff = DamageCalculator.isEffective;
DamageCalculator.isEffective = function(active, passive, weapon, isCritical, trueHitValue) {
    var effective = eff.call(this, active, passive, weapon, isCritical, trueHitValue);

    if (!effective) {
        effective = TraitControl.isEffective(active, passive, weapon);
    }

    return effective;
};

//Traits can be a requirement for using weapons
var wa = ItemControl.isWeaponAvailable;
ItemControl.isWeaponAvailable = function(unit, item) {
    var available = wa.call(this, unit, item);

    if (available) {
        available = TraitControl.canUse(unit, item);
    }

    return available;
};

//Traits can be a requirement for using items
var iu = ItemControl.isItemUsable;
ItemControl.isItemUsable = function(unit, item) {
    var usable = iu.call(this, unit, item);
    if (usable) {
        usable = TraitControl.canUse(unit, item);
    }

    return usable;
};

//Traits can be a requirement for a class change
var cea = ClassChangeChecker.createClassEntryArray;
ClassChangeChecker.createClassEntryArray = function(unit, classGroup) {
    var classEntryArray = cea.call(this, unit, classGroup);
    var i, cls, change;
    for (i=classEntryArray.length-1; i>=0; i--) {
        cls = classEntryArray[i].cls;
        if (!TraitControl.canChange(unit, cls)) {
            classEntryArray.splice(i, 1);
        }
    }

    return classEntryArray;
};

//A custom item that gives a trait
var TraitItemSelection = defineObject(BaseItemSelection, {

});

var TraitItemUse = defineObject(BaseItemUse, {
    _unit: null,
    _traitID: null,

    enterMainUseCycle: function(itemUseParent) {
        this._unit = itemUseParent.getItemTargetInfo().targetUnit;
        this._traitID = itemUseParent.getItemTargetInfo().item.custom.addTrait;
		return EnterResult.OK;
	},

    moveMainUseCycle: function() {
        this.mainAction();
        return MoveResult.END;
    },

    mainAction: function() {
        TraitControl.addUnitTrait(this._unit, this._traitID);
    }
});

var TraitItemInfo = defineObject(BaseItemInfo, {

});

var TraitItemPotency = defineObject(BaseItemPotency, {

});

var TraitItemAvailability = defineObject(BaseItemAvailability, {

    isItemAllowed: function(unit, targetUnit, item) {
        return !TraitControl.hasTrait(unit, item.custom.addTrait);
    }

});

var TraitItemAI = defineObject(BaseItemAI, {

});


var c1 = ItemPackageControl.getCustomItemSelectionObject;
ItemPackageControl.getCustomItemSelectionObject = function(item, keyword) {
    if (keyword=="Trait") {
        return TraitItemSelection;
    }
    else {
        return c1.call(this, item, keyword);
    }
};

var c2 = ItemPackageControl.getCustomItemUseObject;
ItemPackageControl.getCustomItemUseObject = function(item, keyword) {
    if (keyword=="Trait") {
        return TraitItemUse;
    }
    else {
        return c2.call(this, item, keyword);
    }
};

var c3 = ItemPackageControl.getCustomItemInfoObject = function(item, keyword) {
    if (keyword=="Trait") {
        return TraitItemInfo;
    }
    else {
        return c3.call(this, item, keyword);
    }
};

var c4 = ItemPackageControl.getCustomItemPotencyObject;
ItemPackageControl.getCustomItemPotencyObject = function(item, keyword) {
    if (keyword=="Trait") {
        return TraitItemPotency;
    }
    else {
        return c4.call(this, item, keyword);
    }
};

var c5 = ItemPackageControl.getCustomItemAvailabilityObject;
ItemPackageControl.getCustomItemAvailabilityObject = function(item, keyword) {
    if (keyword=="Trait") {
        return TraitItemAvailability;
    }
    else {
        return c5.call(this, item, keyword);
    }
};

var c6 = ItemPackageControl.getCustomItemAIObject;
ItemPackageControl.getCustomItemAIObject = function(item, keyword) {
    if (keyword=="Trait") {
        return TraitItemAI;
    }
    else {
        c6.call(this, item, keyword);
    }
}