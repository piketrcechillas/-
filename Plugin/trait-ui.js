var it1 = ItemInfoWindow._configureWeapon;
ItemInfoWindow._configureWeapon = function(groupArray) {
    it1.call(this, groupArray);
    groupArray.appendObject(ItemSentence.Trait);
};

var it2 = ItemInfoWindow._configureItem;
ItemInfoWindow._configureItem = function(groupArray) {
    it2.call(this, groupArray);
    groupArray.appendObject(ItemSentence.Trait);
};

//Trait UI
ItemSentence.Trait = defineObject(BaseItemSentence, {

    drawItemSentence: function(x, y, item) {
        var textui = root.queryTextUI('default_window');
		var color = textui.getColor();
		var font = textui.getFont();
        var text;
        
        itemTraits = item.custom.trait!=null ? item.custom.trait : [];
        var i, trait;
        var dx = ItemInfoRenderer.getSpaceX();

        if (itemTraits.length>0) {
            text = "Trait";
            ItemInfoRenderer.drawKeyword(x, y, text);
        }

        for (i=0; i<itemTraits.length; i++) {
            trait = TraitControl.getTrait(itemTraits[i]);
            TextRenderer.drawKeywordText(x + dx, y, trait.name, 10, color, font);
            
            y += ItemInfoRenderer.getSpaceY();
        }

		
    },

    getItemSentenceCount: function(item) {
        itemTraits = item.custom.trait!=null ? item.custom.trait : [];
        return itemTraits.length;
    }
});


//Effective UI
ItemSentence.Effective.drawItemSentence = function(x, y, item) {
    var aggregation = this._getAggregation(item);
    var textui = ItemInfoRenderer.getTextUI();
    var color = textui.getColor();
    var font = textui.getFont();

    if (this.getItemSentenceCount(item)>0) {
        ItemInfoRenderer.drawKeyword(x, y, this._getName());
        x += ItemInfoRenderer.getSpaceX();


        var i, obj, objName, objecttype, suffix;
        var count = aggregation.getObjectCount();        
        //Normal effective data
        for (i = 0 ; i < count; i++) {
            obj = aggregation.getObjectData(i);
            objName = obj.getName();
            objecttype = obj.objecttype;
            
            if (objecttype === ObjectType.WEAPON) {
                suffix = StringTable.Aggregation_SuffixEquipment;
            }
            else if (objecttype === ObjectType.ITEM || objecttype === ObjectType.SKILL) {
                suffix = StringTable.Aggregation_SuffixPossession;
            }
            else if (objecttype === ObjectType.STATE) {
                suffix = StringTable.Aggregation_SuffixAddition;
            }
            else {
                suffix = '';
            }
            
            TextRenderer.drawKeywordText(x, y, objName + suffix, -1, color, font);
            y += ItemInfoRenderer.getSpaceY();
        }        
    
        //Effective traits
        var traitArray = item.custom.effTrait!=null ? item.custom.effTrait : [];
        var trait;
    
        for (i=0; i<traitArray.length; i++) {
            trait = TraitControl.getTrait(traitArray[i]);
            TextRenderer.drawKeywordText(x, y, trait.name, 10, color, font);
            y += ItemInfoRenderer.getSpaceY();
        } 
    }
};

ItemSentence.Effective.getItemSentenceCount = function(item) {
    var aggregationCount = this._getAggregation(item).getObjectCount();
    var traitsCount = item.custom.effTrait!=null ? item.custom.effTrait.length : 0;
    return aggregationCount + traitsCount;
};

//Only UI
ItemSentence.Only.drawItemSentence = function(x, y, item) {
    var aggregation = this._getAggregation(item);
    var textui = ItemInfoRenderer.getTextUI();
    var color = textui.getColor();
    var font = textui.getFont();

    if (this.getItemSentenceCount(item)>0) {
        ItemInfoRenderer.drawKeyword(x, y, this._getName());
        x += ItemInfoRenderer.getSpaceX();


        var i, obj, objName, objecttype, suffix;
        var count = aggregation.getObjectCount();        
        //Normal effective data
        for (i = 0 ; i < count; i++) {
            obj = aggregation.getObjectData(i);
            objName = obj.getName();
            objecttype = obj.objecttype;
            
            if (objecttype === ObjectType.WEAPON) {
                suffix = StringTable.Aggregation_SuffixEquipment;
            }
            else if (objecttype === ObjectType.ITEM || objecttype === ObjectType.SKILL) {
                suffix = StringTable.Aggregation_SuffixPossession;
            }
            else if (objecttype === ObjectType.STATE) {
                suffix = StringTable.Aggregation_SuffixAddition;
            }
            else {
                suffix = '';
            }
            
            TextRenderer.drawKeywordText(x, y, objName + suffix, -1, color, font);
            y += ItemInfoRenderer.getSpaceY();
        }        
    
        //Effective traits
        var traitArray = item.custom.userTrait!=null ? item.custom.userTrait : [];
        var trait;
    
        for (i=0; i<traitArray.length; i++) {
            trait = TraitControl.getTrait(traitArray[i]);
            TextRenderer.drawKeywordText(x, y, trait.name, 10, color, font);
            y += ItemInfoRenderer.getSpaceY();
        } 
    }
};

ItemSentence.Only.getItemSentenceCount = function(item) {
    var aggregationCount = this._getAggregation(item).getObjectCount();
    var traitsCount = item.custom.userTrait!=null ? item.custom.userTrait.length : 0;
    return aggregationCount + traitsCount;
};