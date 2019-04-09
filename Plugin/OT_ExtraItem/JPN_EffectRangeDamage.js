
/*-----------------------------------------------------------------------------------------------
  
  範囲攻撃を行うアイテムを実装します。
    
  使用方法:
  アイテムでカスタムを選択し、キーワードにOT_ItemEffectRangeを設定し、
  アイテムのカスタムパラメータに各パラメータを設定してください。(readme参照)

  ・渡せるカスタムパラメータ
  {
      OT_DamageType          : (Damage Type)                // 1 for Physical. 2 for Magical. Anything else for Fixed. If not set, it's 0.
    , OT_Recovery            : (Effect)						// false to deal damage, true to recover HP. Defaults to false.
    , OT_UnitReflection      : (Boosts by Unit power)       // set to true to add unit stats to item damage. (Defaults to false)
    , OT_WeaponReflection    : (Boosts by weapon power)     // set to true to add weapon might to item damage. (Defaults to false)
    , OT_EffectAnime         : [(Animation ID), (Runtime?)]  // (Anime ID) refers to the ID of the animation. (Runtime) can be set to true to use a RTP animation, or false to use an original.(Defaults to null)
    , OT_MinRange            : (Start Range)                // Sets the minimum range of the item. (Defaults to 0)
    , OT_UseDamage           : (Damage Value)               // Sets recoil damage amount as a number(OT_UseDamage:10), or a Percent[?]. Defaults to 0.
	[Original JPN for above: 使用後の反動ダメージを数値で設定します。文字列で'(数値)%'で現HP分の割合ダメージ、'M(数値)%'で最大HP分の割合ダメージとなります(未指定時：0)]
    , OT_UseAddState         : {(StatusID):(%Chance)}       // Set the State ID to add and an activation chance. (Defaults to {})
    , OT_UseDelState         : {(StatusID):(%Chance)}       // Set the State ID to remove and the chance to do so. (Defaults to {})
    , OT_UseDamageAnime      : [(アニメID), (ランタイム使用)]  // 使用者のダメージ時のアニメの設定します{(アニメID)は数値、(ランタイム使用)はfalseかtrueを設定(未指定時：null)}
    , OT_UseDelGoodAnime     : [(アニメID), (ランタイム使用)]  // 使用者のグッドステートが解除された時のアニメの設定します{(アニメID)は数値、(ランタイム使用)はfalseかtrueを設定(未指定時：[200, true])}
    , OT_UseDelBadAnime      : [(アニメID), (ランタイム使用)]  // 使用者のバッドステートが解除された時のアニメの設定します{(アニメID)は数値、(ランタイム使用)はfalseかtrueを設定未指定時：[101, true])}
    , IER_Value              : (ダメージ値)                    // アイテムの威力を数値で設定します(未指定時：0)
    , IER_HitValue           : (命中率)                        // アイテムの命中率を数値で設定します(未指定時：100)
    , IER_AddState           : {(ステートID):(発動率)}         // 攻撃が当たった時に付与させるステートIDと発動率を設定します(未指定時：{})
    , IER_DelState           : {(ステートID):(発動率)}         // 攻撃が当たった時に解除させるステートIDと発動率を設定します(未指定時：{})
    , IER_HitReflection      : [(ユニット依存), (武器依存)]    // (ユニット依存)にtrueを設定すると命中率にユニットの技×3、(武器依存)にtrueを設定すると装備武器の命中率を加算するか設定します(未指定時：[false, false])
    , IER_HitAvoid           : (回避依存)                      // trueを設定すると命中率が「対象ユニットの回避値-アイテムの命中率」になります(未指定時：false)
    , IER_RangeType          : (射程範囲のタイプ)              // ※後述参照　射程範囲の形を指定します(未指定時：0)
    , IER_RangeSpread        : (射程範囲の広がり)              // ※後述参照　一部の射程範囲の広がりを調整します(未指定時：1)
    , IER_EffectRangeType    : (効果範囲のタイプ)              // ※後述参照　効果範囲の形を指定します(未指定時：0)
    , IER_EffectSpread       : (効果範囲の広がり)              // ※後述参照　一部の効果範囲の広がりを調整します(未指定時：1)
    , IER_EffectRange        : '(開始範囲)-(終了範囲)'         // (開始範囲)と(終了範囲)に数値を設定します(未指定時：'0-0')
    , IER_Indifference       : (無差別攻撃)                    // trueを設定すると味方を巻き込む無差別攻撃になります(未指定時：false)
    , IER_EXPMagnification   : (経験値倍率)                    // 一人当たりにHITした時の経験値倍率を設定します(未指定時：1.0)
    , IER_HitAnime           : [(アニメID), (ランタイム使用)]  // 対象に当たった時のアニメの設定します{(アニメID)は数値、(ランタイム使用)はfalseかtrueを設定(未指定時：null)}
    , IER_MissAnime          : [(アニメID), (ランタイム使用)]  // 対象が回避した時のアニメの設定します{(アニメID)は数値、(ランタイム使用)はfalseかtrueを設定(未指定時：null)}
    , IER_DelGoodAnime       : [(アニメID), (ランタイム使用)]  // 対象のグッドステートが解除された時のアニメの設定します{(アニメID)は数値、(ランタイム使用)はfalseかtrueを設定(未指定時：[200, true])}
    , IER_DelBadAnime        : [(アニメID), (ランタイム使用)]  // 対象のバッドステートが解除された時のアニメの設定します{(アニメID)は数値、(ランタイム使用)はfalseかtrueを設定(未指定時：[101, true])}
    , IER_MapChipChangeAfter : [ (設定方法は後述) ]            // 範囲内の特定のマップチップを指定のチップに変更します(省略時：null)
  }
  
  作成者:
  o-to
  
  更新履歴:
  2015/10/11：範囲攻撃アイテムの新規作成(試作型)
  2015/10/13：範囲指定や付加ステータスなど様々な要素を追加
  2015/10/16：公式アップデート1.035に対応するように修正
  2015/10/31：スキルの状態異常無効に対応、敵AIを改善
              ダメージ数値の表示追加、ダメージエフェクトやユニット消滅を同時に再生するよう修正
              ステート付与時のアニメをステートのマップアニメに依存するよう修正
              マップ地形変更効果を追加
              使用時のダメージを敵のダメージと一緒に行うよう変更
  2015/12/04：最新バージョンではエラーで終了してしまうため修正
              ツール側のアニメーション再生に対応
  2016/02/28：
  1.060対応、敵がブロックや味方に囲まれてる場合エラーで終了してしまうため修正
  2016/03/23:
  1.067のエラーの応急手当
  2016/04/25:
  敵が補助オンリーの範囲アイテムを使用しない不具合を修正
  2016/05/03:
  補助オンリー(固定ダメージor固定回復量が0)の場合はダメージ表示とHP回復量の表示が省略されるように修正
  敵AIの行動決定に使用するスコアに倍率を設定可能に
  使用時ダメージにマイナス指定を行うとHP回復するように修正
  与えたダメージのHP吸収率を設定可能に
  2016/07/31:
  1.086対応、使用時にエラーで終了してしまうのを修正

  2016/10/17:
  威力の補正に各ステータスの値が影響する設定ができるように修正
  最終的な攻撃力に補正値を掛ける設定を追加
  一部誤字修正

  2017/01/16:
  Ver 1.109でのステート付与時のエラー対応

  2017/01/29:
  敵がステート付与系の範囲攻撃を行うとエラーとなる問題を修正

  2017/02/05:
  forループ用に使用している変数の宣言忘れしている箇所を修正
  ※同じように宣言忘れしている別スクリプトがあった場合、意図せぬ動作が起こるため

  2017/12/16:
  範囲攻撃アイテムの発動位置選択時にユニットにカーソルを合わせるとエラーで停止する問題を修正

  2018/05/01:
  範囲攻撃で敵を撃破した際にエラーが発生する不具合修正

-----------------------------------------------------------------------------------------------*/

(function() {

var alias1 = ItemPackageControl.getCustomItemSelectionObject;
ItemPackageControl.getCustomItemSelectionObject = function(item, keyword) {
	var result = alias1.call(this, item, keyword);
	
	if (keyword === OT_ItemEffectRange_getCustomKeyword()) {
		//root.log("alias 1")
		return OT_ItemEffectRangeSelection;
	}
	return result;
};

var alias2 = ItemPackageControl.getCustomItemUseObject;
ItemPackageControl.getCustomItemUseObject = function(item, keyword) {
	var result = alias2.call(this, item, keyword);
	if (item.isWeapon()){
		//root.log('alias 2 weapon')
		return OT_ItemEffectRangeUse;
	}
	
	if (keyword === OT_ItemEffectRange_getCustomKeyword()) {
		//root.log("alias 2 item")
		return OT_ItemEffectRangeUse;
	}
	
	return result;
};

var alias3 = ItemPackageControl.getCustomItemInfoObject;
ItemPackageControl.getCustomItemInfoObject = function(item, keyword) {
	var result = alias3.call(this, item, keyword);
	
	if (keyword === OT_ItemEffectRange_getCustomKeyword()) {
		////root.log("alias3")
		return OT_ItemEffectRangeInfo;
	}
	
	return result;
};

var alias4 = ItemPackageControl.getCustomItemAvailabilityObject;
ItemPackageControl.getCustomItemAvailabilityObject = function(item, keyword) {
	var result = alias4.call(this, item, keyword);
	
	if (keyword === OT_ItemEffectRange_getCustomKeyword()) {
		////root.log("Alias4")
		return OT_ItemEffectRangeAvailability;
	}
	
	return result;
};

var alias5 = ItemPackageControl.getCustomItemAIObject;
ItemPackageControl.getCustomItemAIObject = function(item, keyword) {
	var result = alias5.call(this, item, keyword);
	
	if (keyword === OT_ItemEffectRange_getCustomKeyword()) {
		//root.log("Alias5 AI")
		return OT_ItemEffectRangeAI;
	}
	
	return result;
};

// 経験値取得
var alias6 = ItemExpFlowEntry._getItemExperience;
ItemExpFlowEntry._getItemExperience = function(itemUseParent) {
	var exp = alias6.call(this, itemUseParent);

	if( itemUseParent.OT_SetExp != null )
		//root.log("Alias6 exp")
	{
		exp += itemUseParent.OT_SetExp;
	}
	
	if (exp > 100) {
		exp = 100;
	}
	else if (exp < 0) {
		exp = 0;
	}

	return exp;
};

// アイテム発動位置選択時に相手にカーソル合わせた時に表示される
// ミニウィンドウ情報オブジェクトの設定
var alias7 = ItemPackageControl.getCustomItemPotencyObject;
ItemPackageControl.getCustomItemPotencyObject = function(item, keyword) {
	var result = alias7.call(this, item, keyword);
	
	if (item.isWeapon() && item.custom.Splash === true){
		//root.log("Alias7 weapon")
		return createObject(BaseItemPotency);
	}
	
	else if (keyword === OT_ItemEffectRange_getCustomKeyword()) {
		//root.log("Alias7 item")
		return createObject(BaseItemPotency);
	}
	else{
		//root.log("Err, I don't know...")
		return createObject(BaseItemPotency);
	}
	
	return result;
};


var OT_ItemEffectRangeSelection = defineObject(BaseItemSelection,
{
	enterItemSelectionCycle: function(unit, item) {
		this._unit = unit;
		//root.log("unit set.")
		this._item = item;
		//root.log("item found.")
		this._targetUnit = this._unit;
		//root.log("target unit set.")
		this._targetPos = createPos(this._unit.getMapX(), this._unit.getMapY());
		//root.log("targetPos obtained.")
		this._targetClass = null;
		//root.log("targetClass.")
		this._targetItem = null;
		//root.log("targetItem.")
		this._isSelection = false;
		//root.log("Selection false")
		this._posSelector = createObject(OT_EffectRangePosSelector);
		//root.log("Selector created")
		
		return this.setInitialSelection();
	},
	setInitialSelection: function() {
		this.setPosSelection();
		//root.log("initial selection set.")
		return EnterResult.OK;
	},

	// アイテムを特定の位置に対して使用する場合に呼ばれる
	setPosSelection: function() {
		var filter = this.getUnitFilter();
		var indexArray = OT_EffectRangeIndexArray.createIndexArray(this._unit.getMapX(), this._unit.getMapY(), this._item);
		this._posSelector.setUnitOnly(this._unit, this._item, indexArray, PosMenuType.Item, filter);
		this.setFirstPos();
		//root.log("first pos set")
	},

	// アイテム使用時に射程範囲内かを確認
	isPosSelectable: function() {
		//root.log("checking pos")
		this._targetPos = this._posSelector.getSelectorPos(true);
		//root.log("pos selectable.")
		return this._targetPos !== null;
	},
			
	getUnitFilter: function() {
		var indifference = false;
		//root.log("Unit Flag PLAYER")
		return UnitFilterFlag.PLAYER;
	}
}
);

var OT_ItemEffectRangeUseMode = {
	  START          : 0
	, ANIME          : 1
	, DAMAGE         : 2
	, ERASE          : 3
	, FLOWENTRY      : 4
	, FLOW           : 5
	, STATEENTRY     : 6
	, STATE          : 7
	, USEAFTER       : 8
	, END            : 9
};

var OT_ItemEffectRangeAnimeID = {
	  DAMAGE         : 10000
};

var OT_ItemEffectRangeUse = defineObject(BaseItemUse,
{
	_dynamicEvent: null,
	_targetPos: null,
	_itemTargetInfo: null,
	_itemUseParent: null,
	_damagePopup: null,

	_dynamicAnime: Array(),
	_HitUnit: Array(),
	_AvoidUnit: Array(),
	_deadUnit: Array(),
	_HitDamage: Array(),
	_damageHitFlow: Array(),

	_eraseCounter: 0,
	_FrameCount: 0,

	_prepareData: function() {
		this._dynamicAnime = Array();
		this._HitUnit = Array();
		this._AvoidUnit = Array();
		this._deadUnit = Array();
		
		this._HitDamage = Array();
		this._FrameCount = 0;
		this._eraseCounter = createObject(EraseCounter);
		this._damageHitFlow = null;
	},
	
	enterMainUseCycle: function(itemUseParent) {
		this._prepareData();
		
		var generator;
		this._itemUseParent = itemUseParent;
		this._itemTargetInfo = itemUseParent.getItemTargetInfo();
		this._targetPos = this._itemTargetInfo.targetPos;
		var type;
		if (this._itemTargetInfo.item.isWeapon()){
			type = SelectionRangeType.MULTI;
		}
		else{
			type = this._itemTargetInfo.item.getRangeType();
		}
		var unit = this._itemTargetInfo.targetUnit;
		this._itemUseParent.OT_SetExp = 0;

		// AIによるアイテム使用では、位置が初期化されていないことがある
		if (this._targetPos === null) {
			this._targetPos = createPos(unit.getMapX(), unit.getMapY());
		}
		
		this._dynamicEvent = createObject(DynamicEvent);
		generator = this._dynamicEvent.acquireEventGenerator();

		// カメラ位置変更
		if (type !== SelectionRangeType.SELFONLY) {
			generator.locationFocus(this._targetPos.x, this._targetPos.y, true);
		}


		if (this._itemTargetInfo.item.isWeapon()){
			this.changeCycleMode(OT_ItemEffectRangeUseMode.START);
			this.moveMainUseCycle();
			return EnterResult.OK;
		}
		this.changeCycleMode(OT_ItemEffectRangeUseMode.START);
		this._dynamicEvent.executeDynamicEvent();
		return EnterResult.OK;
	},
	
	_drawFlow: function() {
		this._damageHitFlow.drawDamageHitFlowCycle();
	},
	
	_isLosted: function(unit) {
		return unit.getHp() <= 0;
	},
	
	_setDamage: function(unit, damage) {
		var hp;
		
		if (damage < 1) {
			return;
		}
		
		// ダメージ分だけユニットのhpを減らす
		hp = unit.getHp() - damage;
		if (hp <= 0) {
			// ユニットが不死身である場合は、hpを1でとどめる
			if (unit.isImmortal()) {
				unit.setHp(1);
			}
			else {
				unit.setHp(0);
				// 状態を死亡に変更する
				DamageControl.setDeathState(unit);
			}
		}
		else {
			unit.setHp(hp);
		}
	},
	
	_getDamageValue: function() {
		root.log("getting damage values")
		var eventCommandData = root.getEventCommandObject();
		var unit = eventCommandData.getTargetUnit();
		var damage = eventCommandData.getDamageValue();
		var type = eventCommandData.getDamageType();
		
		return Calculator.calculateDamageValue(unit, damage, type, 0);
	},

	moveUseAfter: function() {
		if(this._dynamicEvent.moveDynamicEvent() == MoveResult.END)
		{
			this.changeCycleMode(OT_ItemEffectRangeUseMode.END);
		}
		
		return MoveResult.CONTINUE;
	},

	moveMainUseCycle: function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;

		////root.log('test');
		if (mode === OT_ItemEffectRangeUseMode.START) {
			result = this.moveEvent();
			//root.log('cycle: start, moveEvent');
		}
		else if (mode === OT_ItemEffectRangeUseMode.ANIME) {
			//result = MoveResult.END;
			result = this.moveAnime();
			//root.log('cycle: moveAnime');
		}
		else if (mode === OT_ItemEffectRangeUseMode.DAMAGE) {
			//result = MoveResult.END;
			result = this.moveDamage();
			//root.log('cycle: moveDamage');
		}
		else if (mode === OT_ItemEffectRangeUseMode.ERASE) {
			//result = MoveResult.END;
			result = this.moveErase();
			////root.log('damage');
		}
		else if (mode === OT_ItemEffectRangeUseMode.FLOWENTRY) {
			//result = MoveResult.END;
			result = this.moveFlowEntry();
			////root.log('damage');
		}
		else if (mode === OT_ItemEffectRangeUseMode.FLOW) {
			//result = MoveResult.END;
			result = this.moveFlow();
			////root.log('damage');
		}
		else if (mode === OT_ItemEffectRangeUseMode.STATEENTRY) {
			//result = MoveResult.END;
			result = this.moveStateEntry();
			////root.log('damage');
		}
		else if (mode === OT_ItemEffectRangeUseMode.STATE) {
			//result = MoveResult.END;
			result = this.moveState();
			////root.log('damage');
		}
		else if (mode === OT_ItemEffectRangeUseMode.USEAFTER) {
			result = MoveResult.END;
			//result = this.moveUseAfter();
			////root.log('damage');
		}
		else if (mode === OT_ItemEffectRangeUseMode.END) {
			result = MoveResult.END;
			////root.log('end');
		}

		return result;
	},

	drawMainUseCycle: function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;

		////root.log('test');
		if (mode === OT_ItemEffectRangeUseMode.ANIME) {
			//this.drawTest();
			////root.log('start');
		}
		else if (mode === OT_ItemEffectRangeUseMode.DAMAGE) {
			this.drawDamage();
			////root.log('damage');
		}
		else if (mode === OT_ItemEffectRangeUseMode.ERASE) {
			this.drawErase();
		}
		else if (mode === OT_ItemEffectRangeUseMode.FLOW) {
			this.drawFlow();
		}
		else if (mode === OT_ItemEffectRangeUseMode.STATE) {
			this.drawState();
		}
		
	},

	moveEvent: function() {
		//root.log("moveEvent started")
		var item = this._itemTargetInfo.item;

		if(this._dynamicEvent.moveDynamicEvent() == MoveResult.END)
		{
			var generator = this._dynamicEvent.acquireEventGenerator();
			//root.log("generator")
			// アニメーション実行
			var x = LayoutControl.getPixelX(this._targetPos.x);
			var y = LayoutControl.getPixelY(this._targetPos.y);
			var anime = OT_getCustomItemAnimeData(item);
			var pos = LayoutControl.getMapAnimationPos(x, y, anime);
	
			if( anime !== null )
			{
				generator.animationPlay(anime, pos.x, pos.y, false, AnimePlayType.SYNC, 9999);
			}
			if(item.isWeapon()){
				this.changeCycleMode(OT_ItemEffectRangeUseMode.ANIME);
				this.moveMainUseCycle();
				return MoveResult.CONTINUE;
			}
			this.changeCycleMode(OT_ItemEffectRangeUseMode.ANIME);
			this._dynamicEvent.executeDynamicEvent();
		}
		return MoveResult.CONTINUE;
	},
	
	moveAnime: function() {
		var item = this._itemTargetInfo.item;
		var unit = this._itemTargetInfo.unit;
		//root.log("moveAnime started")
		if(this._dynamicEvent.moveDynamicEvent() == MoveResult.END)
		{
			var generator = this._dynamicEvent.acquireEventGenerator();
			var indexArray = OT_EffectRangeIndexArray.getEffectRangeItemIndexArray(this._targetPos.x, this._targetPos.y, item, this._itemTargetInfo.unit);

			// ダメージ判定など準備
			var i, index, px, py, targetUnit;
			var length = indexArray.length;
			var damage = OT_getCustomItemFinalDamage(unit, item);
			var damageType  = OT_getCustomItemType(item);
			var damagePoint = 0;
			var totalPoint  = 0;
			//var plus = OT_getCustomItemPlus(this._itemTargetInfo.unit, item);
			var indifference = OT_getCustomItemIndifference(item);
			var Magnification = OT_getCustomItemEXPMagnification(item);
			var isRecovery = OT_getCustomItemRecovery(item);
			var noDamage = OT_getNoDamegeAttack(item);

			// 解除されるステート
			var delState = OT_getCustomItemDelState(item);

			// 追加されるステート
			var addState = OT_getCustomItemAddState(item);
			
			// 変更後のマップチップ
			var changeChip = OT_getCustomItemMapChipChangeDate(item);
			
			// アニメーション実行準備
			var x, y, pos, i;

			for (i = 0; i < length; i++) {
				index = indexArray[i];
				px = CurrentMap.getX(index);
				py = CurrentMap.getY(index);
				targetUnit = PosChecker.getUnitFromPos(px, py);

				var terrain = PosChecker.getTerrainFromPos(px, py);
				//var terrainBack = root.getCurrentSession().getTerrainFromPos(px, py, false);
				//var img = terrainBack.getMapChipImage();
				//var terrainID = terrain.getId();
				//var imgID = img.getId();
				//var imgRuntime = img.isRuntime();
				
				////root.log(terrainBack.getName() + ':' + terrainBack.getId() + ':' + img.getId() + ':' + img.isRuntime() + ':' + terrainBack.custom.test);
				////root.log(terrain.getName() + ':' + terrain.getId() + ':' + img.getId() + ':' + img.isRuntime() + ':' + terrainBack.custom.test);
				////root.log(terrain.getName() + ':' + terrain.getId() + ':' + terrain.custom.IER_MapChipChangeGroup[0]);

				if( changeChip != null )
				{
					ChipLength = changeChip.length;
					for( j=0 ; j<ChipLength ; j++ )
					{
						chip = changeChip[j];
						
						if( chip[1] == false && targetUnit != null ) continue;
						
						if( OT_isCustomItemMapChipChange(chip, terrain) )
						{
							var handle2 = root.getCurrentSession().getMapChipGraphicsHandle(px, py, false);
							generator.mapChipChange(px, py, false, handle2);
							if(chip[2].length == 4)
							{
								var handle = root.createResourceHandle(chip[2][0], chip[2][1], 0, chip[2][2], chip[2][3]);
								generator.mapChipChange(px, py, true, handle);
							}
						}
					}
				}
				
				////root.log('x:' + px + ' y:' + py);
				if(targetUnit !== null){
					//root.log("targetUnit not null, anime")
					// 無差別攻撃じゃなければ味方に当たらないようにする
					if(indifference == false)
					{
						if( this.getUnitTypeAllowed(this._itemTargetInfo.unit, targetUnit, isRecovery) === true ){
							continue;
						}
					}
					//_targetUnit.push(targetUnit);

					// 当たり判定を確認する
					if( OT_getCustomItemHitCheck(this._itemTargetInfo.unit, targetUnit, item) === false ){
						var pushData = [targetUnit, false];//argument
						var anime = OT_getCustomItemMissAnimeData(item);
						
						if( anime != null || item.isWeapon() && anime == null)
						{
							// ユニットの位置取得
							if (anime == null){
								anime=root.queryAnime("easyavoid")
							}
							x = LayoutControl.getPixelX( px );
							y = LayoutControl.getPixelY( py );
							pos = LayoutControl.getMapAnimationPos(x, y, anime);

							// アニメ再生
							var dynamicAnime = createObject(DynamicAnime);
							dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
							this._dynamicAnime.push(dynamicAnime);
							
							pushData[1] = true;
						}
						if (item.isWeapon()){
							generator.animationPlay(anime, pos.x+32, pos.y-32, false, AnimePlayType.SYNC, 9999);
						}
						this._AvoidUnit.push(pushData);
						continue;
					}
					
					this._HitUnit.push(targetUnit);
				}
				
			}
			
			var hitLength = this._HitUnit.length;
			var avoidLength = this._AvoidUnit.length;
			var useDamage = 0;

			// ヒットしたキャラと回避したキャラの処理を埋め込む
			for ( i = 0; i < hitLength; i++ ) {
				targetUnit = this._HitUnit[i];
				
				x = LayoutControl.getPixelX( targetUnit.getMapX() );
				y = LayoutControl.getPixelY( targetUnit.getMapY() );

				if(!noDamage)
				{
					if(isRecovery)
					{
						// ユニットの回復
						var anime = root.queryAnime('easyrecovery');
						generator.hpRecovery( targetUnit, anime, damage, RecoveryType.SPECIFY, true );
						damagePoint = Calculator.calculateRecoveryValue(targetUnit, damage, RecoveryType.SPECIFY, 0) * -1;
	
						if( unit === targetUnit )
						{
							useDamage = damagePoint;
						}
						else
						{
							// 効果音再生
							var soundHandle = root.querySoundHandle('gaugechange');
							MediaControl.soundPlay(soundHandle);
							this._HitDamage.push( {unit:targetUnit, value:damagePoint, x:x, y:y} );
						}
						totalPoint += damagePoint;
					}
					else{
						// ダメージ値の取得
						//root.log("acquire damage value")
						damagePoint = Calculator.calculateDamageValue(targetUnit, damage, damageType, 0);
						
						if( unit === targetUnit )
						{
							useDamage = damagePoint;
						}
						else{
							//root.log("no recoil")
							var anime = OT_getCustomItemHitAnimeData(item);
							
							if(anime == null && !item.isWeapon())
							{
								root.log("null anime")
								// 効果音再生
								var soundHandle = root.querySoundHandle('damage');
								MediaControl.soundPlay(soundHandle);
								anime = root.queryAnime('easydamage');
							}
							pos = LayoutControl.getMapAnimationPos(x, y, anime);
		
							// アニメ再生
							var dynamicAnime = createObject(DynamicAnime);
							dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
							this._dynamicAnime.push(dynamicAnime);
							
							this._HitDamage.push( {unit:targetUnit, value:damagePoint, x:x, y:y} );
						}
						
						totalPoint += damagePoint;
					}
				}
				
				var data = StructureBuilder.buildAttackExperience();
				data.active = this._itemTargetInfo.unit;
				data.activeHp = 0;
				data.activeDamageTotal = 0;
				data.passive = targetUnit;
				data.passiveHp = targetUnit.getHP() - damagePoint;
				if (item.isWeapon()){
					var WepAnime;
					if (OT_getCustomItemHitAnimeData(item) !== null){
						WepAnime = OT_getCustomItemHitAnimeData(item);
					}
					else{
						WepAnime = root.queryAnime('easydamage');
					}//dragonforce
					generator.animationPlay(WepAnime, pos.x, pos.y-16, false, AnimePlayType.SYNC, 9999);
					targetUnit.setHP(targetUnit.getHP() - damagePoint)
					if(targetUnit.getHP() <= 0){
						DamageControl.setDeathState(targetUnit);
					}
				}
				data.passiveDamageTotal = damagePoint;
				this._itemUseParent.OT_SetExp += Math.floor( ExperienceCalculator.calculateExperience(data) * Magnification );
				//this._itemUseParent.OT_SetExp += Math.floor( ExperienceValueControl.calculateExperience(this._itemTargetInfo.unit, 0, 0, targetUnit, targetUnit.getHP() - damagePoint, damagePoint) * Magnification );
			}

			// 使用者を巻き込んでる場合、ダメージ量を一旦退避
			var userPoint = useDamage;

			// 使用後の反動ダメージを加算
			useDamage += OT_getCustomItemUseDamage(item, unit);
			
			// ダメージを吸収する
			useDamage -= OT_getAbsorptionRateValue(item, totalPoint);
			////root.log(userPoint);
			////root.log(useDamage);

			if( useDamage > 0 ){
				//root.log("useDamage > 0")
				// ユニットの位置取得
				x = LayoutControl.getPixelX( unit.getMapX() );
				y = LayoutControl.getPixelY( unit.getMapY() );

				var anime = OT_getCustomItemUseDamageAnimeData(item);

				if(anime == null)
				{
					// 効果音再生
					var soundHandle = root.querySoundHandle('damage');
					MediaControl.soundPlay(soundHandle);
					anime = root.queryAnime('easydamage');
				}
				pos = LayoutControl.getMapAnimationPos(x, y, anime);

				// アニメ再生
				var dynamicAnime = createObject(DynamicAnime);
				dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
				this._dynamicAnime.push(dynamicAnime);

				if( OT_getUseDamageDeath(item) == false )
				{
					var hp = unit.getHp() - useDamage;
					if (hp <= 0) {
						useDamage = unit.getHp() - 1;
						useDamage += userPoint; // 自分がまきこまれた分のダメージ量はちゃんと受ける
					}
				}

				this._HitDamage.push( {unit:unit, value:useDamage, x:x, y:y} );
			}
			else if( useDamage < 0 ){
				//root.log("useDamage < 0")
				// ユニットの位置取得
				x = LayoutControl.getPixelX( unit.getMapX() );
				y = LayoutControl.getPixelY( unit.getMapY() );
				//pos = LayoutControl.getMapAnimationPos(x, y);

				// ユニットの回復
				var anime = root.queryAnime('easyrecovery');
				generator.hpRecovery( unit, anime, (useDamage * -1), RecoveryType.SPECIFY, true );

				// 効果音再生
				var soundHandle = root.querySoundHandle('gaugechange');
				MediaControl.soundPlay(soundHandle);
				
				this._HitDamage.push( {unit:unit, value:useDamage, x:x, y:y} );
			}

			if( this._HitDamage.length == 0 && avoidLength == 0 )
			{
				this.changeCycleMode(OT_ItemEffectRangeUseMode.STATEENTRY);
				root.log("STATEENTRY")
				this.moveMainUseCycle();
			}
			else
			{
				this.changeCycleMode(OT_ItemEffectRangeUseMode.DAMAGE);
				this.drawDamage()
				root.log("DAMAGE")
				this.moveMainUseCycle();
			}
			this._dynamicEvent.executeDynamicEvent();
		}
		
		return MoveResult.CONTINUE;
	},

	// ダメージ処理
	moveDamage: function() {
		var item = this._itemTargetInfo.item;
		var unit = this._itemTargetInfo.unit;
		var length = this._dynamicAnime.length;
		var hitLength = this._HitDamage.length;
		var avoidLength = this._AvoidUnit.length;
		var isEnd = true;
		var noDamage = OT_getNoDamegeAttack(item);
		var i;
		
		for ( i = 0; i < length; i++ ) {
			if (this._dynamicAnime[i].moveDynamicAnime() == MoveResult.CONTINUE) {
				isEnd = false;
			}
			else
			{
				this._dynamicAnime[i].endEffect();
				isEnd = true;
			}
		}

		if(isEnd){
			root.log("isEnd true")
			// 50フレーム待機
			if( this._FrameCount > 50){
				this.changeCycleMode(OT_ItemEffectRangeUseMode.STATEENTRY);
				for ( var i = 0; i < hitLength; i++ ) {
					var hit = this._HitDamage[i];

					// ダメージを与える。ここで対象のHPが変化する
					this._setDamage( hit['unit'], hit['value'] );
					
					// 対象が死亡した場合
					if( this._isLosted( hit['unit'] ) ) {
						// ユニットの消去処理で明示的にユニットを描画するために、デフォルト描画を無効
						hit['unit'].setInvisible(true);
						this._deadUnit.push( hit['unit'] );
						this.changeCycleMode(OT_ItemEffectRangeUseMode.ERASE);
					}
				}
				this._FrameCount = 0;
			}
			else
			{
				this._FrameCount++;
			}
		}
		
		return MoveResult.CONTINUE;
	},

	// 死亡キャラの消滅処理
	moveErase: function() {
		if (this._eraseCounter.moveEraseCounter() !== MoveResult.CONTINUE) {
			this.changeCycleMode(OT_ItemEffectRangeUseMode.FLOWENTRY);
		}

		return MoveResult.CONTINUE;
	},

	// 死亡キャラのアイテムドロップやイベントの開始処理
	moveFlowEntry: function() {
		var item = this._itemTargetInfo.item;
		var unit = this._itemTargetInfo.unit;
		var targetUnit = this._deadUnit.shift();

		// 全ての死亡キャラの処理が完了したら状態異常の付与へ
		if( targetUnit == null ) 
		{
			this.changeCycleMode(OT_ItemEffectRangeUseMode.STATEENTRY);
			return MoveResult.CONTINUE;
		}
		
		this._damageHitFlow = createObject(DamageHitFlow);
		if (this._damageHitFlow.enterDamageHitFlowCycle(unit, targetUnit) === EnterResult.NOTENTER)
		{
			return MoveResult.CONTINUE;
		}
		this.changeCycleMode(OT_ItemEffectRangeUseMode.FLOW);

		return MoveResult.CONTINUE;
	},

	moveStateEntry: function() {
		var item = this._itemTargetInfo.item;
		var unit = this._itemTargetInfo.unit;
		var hitLength = this._HitUnit.length;
		this._dynamicAnime = Array();
		var addState, delState, list, isGood, isBad, result1, result2;
		var x, y, pos;
		list = root.getBaseData().getEffectAnimationList(true);

		if( unit.getHP() > 0 )
		{
			x = LayoutControl.getPixelX( unit.getMapX() );
			y = LayoutControl.getPixelY( unit.getMapY() );
	
			// 使用時に追加されるステート
			addState = OT_getCustomItemUseAddState(item);
	
			// 使用時に解除されるステート
			delState = OT_getCustomItemUseDelState(item);
	
			// ステートの追加
			for( var j=0 ; j<addState.length ; j++)
			{
				if( Probability.getProbability( addState[j][1] ) && StateControl.getTurnState( unit, addState[j][0] ) === null )
				{
					// 耐性ステートを確認
					if (StateControl.isStateBlocked(unit, unit, addState[j][0])) {
						// ステートは無効対象であるため発動しない
						continue;
					}
						
					StateControl.arrangeState(unit, addState[j][0], IncreaseType.INCREASE);
					
					// アニメ再生
					var anime = addState[j][0].getEasyAnime();
					pos = LayoutControl.getMapAnimationPos(x, y, anime);
					var dynamicAnime = createObject(DynamicAnime);
					dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
					this._dynamicAnime.push(dynamicAnime);
				}
			}

			// ステートの解除
			result = OT_setCustomItemDelState(unit, delState);
	
			if( result & 0x01 )
			{
				// アニメ再生
				var anime = OT_getCustomItemUseDeleteBadAnimeData(item);
				pos = LayoutControl.getMapAnimationPos(x, y, anime);
				var dynamicAnime = createObject(DynamicAnime);
				dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
				this._dynamicAnime.push(dynamicAnime);
			} 
			
			if( result & 0x02 )
			{
				var anime = OT_getCustomItemUseDeleteGoodAnimeData(item);
				pos = LayoutControl.getMapAnimationPos(x, y, anime);
				var dynamicAnime = createObject(DynamicAnime);
				dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
				this._dynamicAnime.push(dynamicAnime);
			}
		}
			
		// ヒットしたキャラしたキャラに状態異常処理を埋め込む
		for ( var i = 0; i < hitLength; i++ ) {
			var targetUnit = this._HitUnit[i]
			
			if( targetUnit.getHP() <= 0 ) continue;
			
			x = LayoutControl.getPixelX( targetUnit.getMapX() );
			y = LayoutControl.getPixelY( targetUnit.getMapY() );

			// 解除されるステート
			delState = OT_getCustomItemDelState(item);

			// 追加されるステート
			addState = OT_getCustomItemAddState(item);

			// ステートの追加
			for( var j=0 ; j<addState.length ; j++)
			{
				if( Probability.getProbability( addState[j][1] ) && StateControl.getTurnState( targetUnit, addState[j][0] ) === null )
				{
					// 耐性ステートを確認
					if (StateControl.isStateBlocked(targetUnit, unit, addState[j][0])) {
						// ステートは無効対象であるため発動しない
						continue;
					}
						
					StateControl.arrangeState(targetUnit, addState[j][0], IncreaseType.INCREASE);
					
					// アニメ再生
					var anime = addState[j][0].getEasyAnime();
					pos = LayoutControl.getMapAnimationPos(x, y, anime);
					var dynamicAnime = createObject(DynamicAnime);
					dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
					this._dynamicAnime.push(dynamicAnime);
				}
			}

			// ステートの解除
			result = OT_setCustomItemDelState(targetUnit, delState);
	
			if( result & 0x01 )
			{
				// アニメ再生
				var anime = OT_getCustomItemDeleteBadAnimeData(item);
				pos = LayoutControl.getMapAnimationPos(x, y, anime);
				var dynamicAnime = createObject(DynamicAnime);
				dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
				this._dynamicAnime.push(dynamicAnime);
			} 
			
			if( result & 0x02 )
			{
				var anime = OT_getCustomItemDeleteGoodAnimeData(item);
				pos = LayoutControl.getMapAnimationPos(x, y, anime);
				var dynamicAnime = createObject(DynamicAnime);
				dynamicAnime.startDynamicAnime(anime, pos.x, pos.y);
				this._dynamicAnime.push(dynamicAnime);
			}
		}
		if(item.isWeapon()){
			this.changeCycleMode(OT_ItemEffectRangeUseMode.STATE);
			this.moveMainUseCycle();
			return MoveResult.CONTINUE;
		}
		this.changeCycleMode(OT_ItemEffectRangeUseMode.STATE);
		return MoveResult.CONTINUE;
	},

	// ステート付与アニメ
	moveState: function() {
		var item = this._itemTargetInfo.item;
		var unit = this._itemTargetInfo.unit;
		var length = this._dynamicAnime.length;
		var isEnd = true;

		for ( var i = 0; i < length; i++ ) {
			if (this._dynamicAnime[i].moveDynamicAnime() == MoveResult.CONTINUE) {
				isEnd = false;
			}
			else
			{
				this._dynamicAnime[i].endEffect();
			}
		}

		if(isEnd)
		{
			return MoveResult.END;
		}

		return MoveResult.CONTINUE;
	},
		
	moveFlow: function() {
		if( this._damageHitFlow.moveDamageHitFlowCycle() === MoveResult.END )
		{
			this.changeCycleMode(OT_ItemEffectRangeUseMode.FLOWENTRY);
		}

		return MoveResult.CONTINUE;
	},

	drawDamage: function() {
		var item = this._itemTargetInfo.item;
		var isRecovery = OT_getCustomItemRecovery(item);
		var length = this._dynamicAnime.length;
		var hitLength = this._HitDamage.length;
		var avoidLength = this._AvoidUnit.length;

		for ( var i = 0; i < length; i++ ) {
			this._dynamicAnime[i].drawDynamicAnime();
		}
		// ダメージ値の描写
		for ( var i = 0; i < hitLength; i++ ) {
			var hit = this._HitDamage[i];
			
			if( hit['value'] < 0 ){
				root.log("drawing damage")
				TextRenderer.drawText(hit['x']+1, hit['y']+1, -hit['value'], -1, 0x101010, TextRenderer.getDefaultFont() );
				TextRenderer.drawText(hit['x'], hit['y'], -hit['value'], -1, 0x50ff50, TextRenderer.getDefaultFont() );
			}
			else{
				TextRenderer.drawText(hit['x']+1, hit['y']+1, hit['value'], -1, 0x101010, TextRenderer.getDefaultFont() );
				TextRenderer.drawText(hit['x'], hit['y'], hit['value'], -1, ColorValue.DEFAULT, TextRenderer.getDefaultFont() );
			}
		}

		// ミスの描写
		for ( var i = 0; i < avoidLength; i++ ) {
			if(this._AvoidUnit[i][1]) continue;
			
			var targetUnit = this._AvoidUnit[i][0];
			var x = LayoutControl.getPixelX( targetUnit.getMapX() );
			var y = LayoutControl.getPixelY( targetUnit.getMapY() );
			
			TextRenderer.drawText(x+1, y+1, 'MISS', -1, 0x101010, TextRenderer.getDefaultFont() );
			TextRenderer.drawText(x, y, 'MISS', -1, 0x5050ff, TextRenderer.getDefaultFont() );
		}
	},

	drawErase: function() {
		var length = this._deadUnit.length;

		// 消滅の描写
		for ( var i = 0; i < length; i++ ) {
			var unit = this._deadUnit[i];
			var x = LayoutControl.getPixelX(unit.getMapX());
			var y = LayoutControl.getPixelY(unit.getMapY());
			var alpha = this._eraseCounter.getEraseAlpha();
			var unitRenderParam = StructureBuilder.buildUnitRenderParam();
			var colorIndex = unit.getUnitType();
			var animationIndex = MapLayer.getAnimationIndexFromUnit(unit);
			
			if (unit.isWait()) {
				colorIndex = 3;
			}
			
			if (unit.isActionStop()) {
				animationIndex = 1;
			}
			
			unitRenderParam.colorIndex = colorIndex;
			unitRenderParam.animationIndex = animationIndex;
			unitRenderParam.alpha = alpha;
			UnitRenderer.drawScrollUnit(unit, x, y, unitRenderParam);
		}
	},
	
	drawFlow: function() {
		if( this._damageHitFlow != null)
			this._damageHitFlow.drawDamageHitFlowCycle();
	},
	
	drawState: function() {
		var length = this._dynamicAnime.length;

		for ( var i = 0; i < length; i++ ) {
			this._dynamicAnime[i].drawDynamicAnime();
		}
	},

	// テスト用
	drawTest: function() {
		NumberRenderer.drawNumber(200, 200, 1000);
		TextRenderer.drawText(200, 250, 'MISS', -1, ColorValue.DEFAULT, TextRenderer.getDefaultFont() );
		
	},

	getUnitTypeAllowed: function(unit, targetUnit, isRecovery) {

		if( isRecovery )
		{
			if( FilterControl.isReverseUnitTypeAllowed(unit, targetUnit) === true )
			{
				return true;
			}
		}
		else
		{
			if( FilterControl.isReverseUnitTypeAllowed(unit, targetUnit) === false )
			{
				return true;
			}
		}

		return false;
	},
	
	// ツール側のアニメーションの再生
	getItemAnimePos: function(itemUseParent, animeData) {
		var targetPos = itemUseParent.getItemTargetInfo().targetPos;
		var x = LayoutControl.getPixelX(targetPos.x);
		var y = LayoutControl.getPixelY(targetPos.y);
		
		return LayoutControl.getMapAnimationPos(x, y, animeData);
	}	
}
);

var OT_ItemEffectRangeInfo = defineObject(BaseItemInfo,
{
	_isAddGoodState:false,
	_isDelGoodState:false,
	_isAddBadState:false,
	_isDelBadState:false,
	_isUseAddGoodState:false,
	_isUseDelGoodState:false,
	_isUseAddBadState:false,
	_isUseDelBadState:false,
	
	drawItemInfoCycle: function(x, y) {
		var px=x, py=y;
		var reflection = this._item.custom.OT_UnitReflection;
		var weaponReflection = this._item.custom.OT_WeaponReflection;
		
		this._drawTitle(x, y);
		y += ItemInfoRenderer.getSpaceY();
		
		this._drawInfo(x, y);
		y += ItemInfoRenderer.getSpaceY();
		
		this.drawRange(x, y, this._item.getRangeValue(), this._item.getRangeType());
		y += ItemInfoRenderer.getSpaceY();

		this.drawEffectRange(x, y);
		y += ItemInfoRenderer.getSpaceY();

		this._drawReflection(x, y);
		y += ItemInfoRenderer.getSpaceY();

		this._drawHit(x, y);
		y += ItemInfoRenderer.getSpaceY();

		if( this._isAddGoodState || this._isAddBadState || this._isDelGoodState || this._isDelBadState )
		{
			this._drawState(x, y);
			y += ItemInfoRenderer.getSpaceY();
		}
		
		if( this._item.custom.OT_UseDamage != null || this._UseisAddGoodState || this._UseisAddBadState || this._isUseDelGoodState || this._isUseDelBadState )
		{
			this._drawRecoil(x, y);
			y += ItemInfoRenderer.getSpaceY();
		}
	},
	
	getInfoPartsCount: function() {
		var count = 6;
		var addState = OT_getCustomItemAddState(this._item);
		var delState = OT_getCustomItemDelState(this._item);
		var useAddState = OT_getCustomItemUseAddState(this._item);
		var useDelState = OT_getCustomItemUseDelState(this._item);
		
		var reflection = this._item.custom.OT_UnitReflection;
		var weaponReflection = this._item.custom.OT_WeaponReflection;
	
		if( addState.length > 0 || delState.length > 0 )
		{
			count++;
			if( OT_getCustomItemisGoodState(addState) ) this._isAddGoodState = true;
			if( OT_getCustomItemisBadState(addState) ) this._isAddBadState = true;
			if( OT_getCustomItemisGoodState(delState) ) this._isDelGoodState = true;
			if( OT_getCustomItemisBadState(delState) ) this._isDelBadState = true;
		}

		if( this._item.custom.OT_UseDamage != null || useAddState.length > 0 || useDelState.length > 0 )
		{
			count++;
			if( OT_getCustomItemisGoodState(useAddState) ) this._isUseAddGoodState = true;
			if( OT_getCustomItemisBadState(useAddState) )  this._isUseAddBadState = true;
			if( OT_getCustomItemisGoodState(useDelState) ) this._isUseDelGoodState = true;
			if( OT_getCustomItemisBadState(useDelState) )  this._isUseDelBadState = true;
		}
		
		return count;
	},
	
	_drawTitle: function(x, y) {
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();

		var item = this._item;
		var text = '';
		
		if( OT_getCustomItemRecovery(this._item) )
		{
			text += 'Group Recovery';
		}
		else
		{
			text += 'Splash Attack';
		}

		if( OT_getCustomItemIndifference(this._item) )
		{
			text += 'Affect Everyone!';
		}

		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		x += 40;
	},

	_drawValue: function(x, y) {
		var item = this._item;
		var damage = OT_getCustomItemDamage(item);
		
		ItemInfoRenderer.drawKeyword(x, y, StringTable.Damage_Pow);
		x += ItemInfoRenderer.getSpaceX();

		NumberRenderer.drawRightNumber(x, y, damage);
		x += 40;

		this._drawInfo(x, y);
	},

	_drawInfo: function(x, y) {
		var text;
		var damageType = OT_getCustomItemType(this._item);
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		
		if (damageType === DamageType.FIXED) {
			text = StringTable.DamageType_Fixed;
		}
		else if (damageType === DamageType.PHYSICS) {
			text = StringTable.DamageType_Physics;
		}
		else {
			text = StringTable.DamageType_Magic;
		}
			
		ItemInfoRenderer.drawKeyword(x, y, StringTable.DamageType_Name);
		x += ItemInfoRenderer.getSpaceX();
		TextRenderer.drawKeywordText(x, y, text, -1, color, font);
		x += 40;
	},

	drawRange: function(x, y, rangeValue, rangeType) {
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		var minRange;
		if (this._item.isWeapon() && typeof OT_getCustomItemRangeMin(this._item) !== "number"){
			minRange = this._item.getStartRange();
		}
		else{
			minRange = OT_getCustomItemRangeMin(this._item);
		}
		var text = '';
		
		ItemInfoRenderer.drawKeyword(x, y, 'Range');
		x += ItemInfoRenderer.getSpaceX();
		
		if (rangeType === SelectionRangeType.SELFONLY) {
			TextRenderer.drawKeywordText(x-17, y, StringTable.Range_Self, -1, color, font);
		}
		else if (rangeType === SelectionRangeType.MULTI) {
			text =  minRange + '-' + rangeValue + '' + '(' + OT_getCustomItemRangeSpread(this._item) + ')';
			TextRenderer.drawKeywordText(x-17, y, text, -1, color, font);
		}
		else if (rangeType === SelectionRangeType.ALL) {
			text =  minRange + '-' + '(' + OT_getCustomItemRangeSpread(this._item) + ')';
			TextRenderer.drawKeywordText(x-17, y, text, -1, color, font);
		}
		x += 40;

		var type = OT_getCustomItemRangeType(this._item);
		ItemInfoRenderer.drawKeyword(x, y, 'Cast Area ');
		x += ItemInfoRenderer.getSpaceX();

		switch( type )
		{
			case OT_EffectRangeType.CROSS:
				text = 'Cross';
				break;
			
			case OT_EffectRangeType.XCROSS:
				text = 'X-Cross';

			case OT_EffectRangeType.DOUBLECROSS:
				text = 'Star';
				break;
			
			default:
				text = 'Normal';
				break;
		}

		TextRenderer.drawKeywordText(x, y, text, -1, color, font);
	},

	drawEffectRange: function(x, y) {
		var text;
		var damageType = OT_getCustomItemType(this._item);
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();

		ItemInfoRenderer.drawKeyword(x, y, 'Radius');
		x += ItemInfoRenderer.getSpaceX();

		var min = OT_getCustomItemEffectRangeMin(this._item);
		var max = OT_getCustomItemEffectRangeMax(this._item);
		text = min + '-' + max + '' + '(' + OT_getCustomItemEffectSpread(this._item) + ')';
		TextRenderer.drawKeywordText(x-17, y, text, -1, color, font);
		x += 40;

		var type = OT_getCustomItemEffectRangeType(this._item);
		ItemInfoRenderer.drawKeyword(x, y, 'Type ');
		x += ItemInfoRenderer.getSpaceX();

		switch( type )
		{
			case OT_EffectRangeType.CROSS:
				text = 'Cross';
				break;
			
			case OT_EffectRangeType.XCROSS:
				text = 'X-Cross';

			case OT_EffectRangeType.DOUBLECROSS:
				text = 'Star';
				break;
			
			case OT_EffectRangeType.LINE:
				text = 'Beam';
				break;

			case OT_EffectRangeType.HORIZONTALLINE:
				text = 'Slash';
				break;

			case OT_EffectRangeType.BREATH:
				text = 'Breath';
				break;

			default:
				text = 'Normal';
				break;
		}

		TextRenderer.drawKeywordText(x, y, text, -1, color, font);
	},

	_drawHit: function(x, y) {
		var px = x, py = y;
		var text;
		var damageType = OT_getCustomItemType(this._item);
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		var text = 'Hit';

		if( !OT_getCustomItemHitAvoid(this._item) )
		{
			text += '(Fixed)';
		}

		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX() + 25;

		var text = OT_getCustomItemHitValue(this._item);
		
		if( OT_getCustomItemHITReflectionUnit(this._item) )
		{
			text += '+Weapon Hit+Unit Stats';
		}

		// if( OT_getCustomItemHITReflectionWeapon(this._item) )
		// {
			// text += '+Weapon Hit';
		// }
		
		TextRenderer.drawKeywordText(x, y, text, -1, color, font);
	},

	_drawReflection: function(x, y) {
		var item = this._item;
		var damage = OT_getCustomItemDamage(item);
		var damageType = OT_getCustomItemType(item);
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		var reflection = item.custom.OT_UnitReflection;
		var weaponReflection = item.custom.OT_WeaponReflection;
		var StatueReflection = item.custom.OT_StatueReflection;
		var text = '';

		ItemInfoRenderer.drawKeyword(x, y, 'Dmg');
		x += ItemInfoRenderer.getSpaceX() - 25;

		text = damage;

		if( reflection == true )
		{
			if(StatueReflection == null)
			{
				if(text !== '') text += '+';

				if (damageType === DamageType.PHYSICS) {
					text += OT_getParamName('POW');
				} else if (damageType === DamageType.MAGIC) {
					text += OT_getParamName('MAG');
				}
			}
			else
			{
				for( var key in StatueReflection )
				{
					if( typeof StatueReflection[key] === 'number' )
					{
						if(text !== '') text += '+';
						text += OT_getParamName(key);
						if(StatueReflection[key] != 1.00)
						{
							text += '*' + StatueReflection[key];
						}
					}
				}
			}
		}
		
		if( weaponReflection == true )
		{
			if(text !== '') text += '+';
			text += 'Weapon';
		}

		var Magnification = OT_getCustomItemDamageMagnification(item);
		if(Magnification != 1.00)
		{
			text = '(' + text + ')*' + Magnification;
		}
	
		TextRenderer.drawKeywordText(x, y, text, -1, color, font);
	},
	
	_drawState: function(x, y) {
		var px = x, py = y;
		var text;
		var damageType = OT_getCustomItemType(this._item);
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		var text = 'State Change';

		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		text = '';

		if( this._isAddGoodState || this._isDelGoodState )
		{
			text += 'GOOD';
			if( this._isAddGoodState )
			{
				text += 'Buff　';
			}
	
			if( this._isDelGoodState )
			{
				text += 'Purge　';
			}
		}

		if( this._isAddBadState || this._isDelBadState )
		{
			text += 'Bad';
			
			if( this._isAddBadState )
			{
				text += 'Debuff　';
			}
			if( this._isDelBadState )
			{
				text += 'Dispel';
			}
		}
		
		TextRenderer.drawKeywordText(x, y, text, 200, color, font);
	},
		
	_drawRecoil: function(x, y) {
		var text;
		var damageType = OT_getCustomItemType(this._item);
		var textui = this.getWindowTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		var damage = this._item.custom.OT_UseDamage;

		var text = 'User';

		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		text = '';

		if( damage != null ) {
			// 文字列で指定されてた場合
			var str = "" + damage;
			var regex = /^(\-?)(.*)$/;
			if (str.match(regex))
			{
				var mainasu = RegExp.$1;
				var val = RegExp.$2;
				val = val.replace(/M/g, 'Max HP');
				if( mainasu == '-' )
				{
					text += 'HP +' + val + ' ';
				}
				else
				{
					text += 'HP -' + val + ' ';
				}
			}
		}

		if( this._isUseAddGoodState || this._isUseDelGoodState )
		{
			text += 'GOOD';
			if( this._isUseAddGoodState )
			{
				text += 'Buff ';
			}
	
			if( this._isUseDelGoodState )
			{
				text += 'Purge ';
			}
		}

		if( this._isUseAddBadState || this._isUseDelBadState )
		{
			text += 'Bad';
			
			if( this._isUseAddBadState )
			{
				text += 'Debuff ';
			}
			if( this._isUseDelBadState )
			{
				text += 'Dispel';
			}
		}
		
		TextRenderer.drawKeywordText(x, y, text, 230, color, font);
	}
	
}
);

var OT_ItemEffectRangeAvailability = defineObject(BaseItemAvailability,
{
	isUnitTypeAllowed: function(unit, targetUnit) {
		return FilterControl.isReverseUnitTypeAllowed(unit, targetUnit);
	},

	// メニューで『使う』が何時でも選択できるように
	isItemAvailableCondition: function(unit, item) {
		if (item.isWeapon()){
			//root.log("Weapon Use available.")
			return true;
		}
		else{
			////root.log("Item use available.")
			return true;
		}
		return false;
	}
}
);

// 範囲攻撃用の敵AI
ActionTargetType.OT_EFFECT_RANGE = 100;
var OT_ItemEffectRangeAI = defineObject(BaseItemAI,
{
	getItemScore: function(unit, combination) {
		if( combination.OT_EffectFlag != true )
		{
			return 15;
		}
		
		var item = combination.item;
		var score = -1;
		var nowScore = -1;
		var maxScore = -1;
		var num = maxNum = 0;
		var index, x, y, index2, x2, y2;
		var tmpUnitX = unit.getMapX(), tmpUnitY = unit.getMapY();
		var filter = this.getUnitFilter(unit, item);
		var point = 0;
		var isRecovery = OT_getCustomItemRecovery(item);
		var isIndifference = OT_getCustomItemIndifference(item);
		var targetIndex = -1;
		var avoid, terrain;
		var cls = unit.getClass();
		var noDamage = OT_getNoDamegeAttack(item);
		
		// 一時的にキャラを移動
		unit.setMapX( CurrentMap.getX(combination.costArray[0].posIndex) );
		unit.setMapY( CurrentMap.getY(combination.costArray[0].posIndex) );

		// 範囲攻撃という点を考慮
		var array = combination.arrayRange;
		var length = array.length;

		for (var i = 0; i < length; i++) {
			//continue;
			index = array[i];
			x = CurrentMap.getX(index);
			y = CurrentMap.getY(index);
			var effectArray = OT_EffectRangeIndexArray.getEffectRangeItemIndexArray(x, y, item, unit);
			var effectLength = effectArray.length;
			
			// HIT人数とスコアを初期化
			num = 0;
			nowScore = -1;
			for (var j = 0; j < effectLength; j++) {
				point = 0;
				index2 = effectArray[j];
				x2 = CurrentMap.getX(index2);
				y2 = CurrentMap.getY(index2);
				var targetUnit = PosChecker.getUnitFromPos(x2, y2);
				
				if(targetUnit !== null)
				{
					var value = this._getValue(unit, item, targetUnit);
					
					if( isRecovery )
					{
						if( !noDamage )
						{
							var maxHp = ParamBonus.getMhp(targetUnit);
							var currentHp = targetUnit.getHp();
							
							if (currentHp === maxHp) {
								point = AIValue.MIN_SCORE;
							}
							
							// HPの減りが激しいユニットほど優先される
							
							baseHp = Math.floor(maxHp * 0.25);
							if (currentHp < baseHp) {
								point = 50;
							}
							
							baseHp = Math.floor(maxHp * 0.5);
							if (currentHp < baseHp) {
								point = 30;
							}
							
							baseHp = Math.floor(maxHp * 0.75);
							if (currentHp < baseHp) {
								point = 10;
							}
						}

						point += this._getStateScoreModeRecovery(unit, targetUnit, item);

						if (point < 0) {
							continue;
						}
						
						point += Miscellaneous.convertAIValue(value);
					}
					else
					{
						if( !noDamage )
						{
							var hp = targetUnit.getHp() - value;
							point = Miscellaneous.convertAIValue(value);
		
							if (hp <= 0) {
								point += 50;
							}
						}
						
						point += 20; //ヒット分
						
						// 正確にやろうとするととんでもなく重くなるためコメントアウト
						//point += this._getHitScore(unit, targetUnit, item);
						
						point += this._getStateScore(unit, targetUnit, item);
					}

					// 味方を巻き込んでた場合、評価を逆転
					if( this._checkFilter(targetUnit, filter) == false )
					{
						if( isIndifference )
						{
							point *= -2;
						}
						else
						{
							point = 0;
						}
					}
					else
					{
						num++;
					}

					nowScore += point;

					if(combination.single)
					{
						break;
					}
				}
			}
			
			// 巻き込んだのが味方だけの場合など
			if(num == 0)
			{
				continue;
			}

			nowScore = OT_getAIScoreRateValue(item, nowScore);

			if( score < nowScore )
			{
				score = nowScore;
				combination.targetPos = createPos(x, y);
				maxNum = num;
			}

		}
		
		if( score >= 0 )
		{
			if (cls.getClassType().isTerrainBonusEnabled() && score >= 0) {
				terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
				avoid = terrain.getAvoid();
				
				score += avoid;
			}
			
			// 一回の行動で複数人を攻撃できるという点を考慮する
			score += (maxNum-1) * 15;
			score -= combination.costArray[0].movePoint;
		}

		// キャラの位置を戻す
		unit.setMapX(tmpUnitX);
		unit.setMapY(tmpUnitY);
		
		return score;
	},
	
	getUnitFilter: function(unit, item) {
		var unitType = unit.getUnitType();
		
		if( OT_getCustomItemRecovery(item) )
		{
			return FilterControl.getNormalFilter(unitType);
		}
		
		return FilterControl.getReverseFilter(unitType);
	},

	_getValue: function(unit, item, targetUnit) {
		var damage = OT_getCustomItemFinalDamage(unit, item);
		var damageType = OT_getCustomItemType(item);

		if(OT_getCustomItemRecovery(item))
		{
			return Calculator.calculateRecoveryValue(targetUnit, damage, RecoveryType.SPECIFY, 0);
		}
		
		return Calculator.calculateDamageValue(targetUnit, damage, damageType, 0);
	},

	_getHitScore: function(unit, targetUnit, item) {
		var hit = OT_getCustomItemHitPercent(unit, targetUnit, item);
		
		// 命中率を優先する場合は数値を下げる
		return Math.floor(hit / 5);
	},
	
	_getStateScore: function(unit, targetUnit, item) {
		var point;
		var score = 0;

		// 解除されるステート
		var delState = OT_getCustomItemDelState(item);

		// 追加されるステート
		var addState = OT_getCustomItemAddState(item);

		// ステートの追加
		for( var i=0 ; i<addState.length ; i++ )
		{
			var state = addState[i][0];
			// 敵対者にグッドステートを付与させるような事があった場合
			if( !state.isBadState() )
			{
				continue;
			}

			point = StateScoreChecker.getScore(unit, targetUnit, state);
			
			if( point > -1 )
			{
				score += point;
			}
		}

		// ステートの解除
		for( var i=0 ; i<delState.length ; i++ )
		{
			var state = delState[i][0];

			// 敵対者のバッドステートを解除させるような事があった場合
			if( state.isBadState() )
			{
				continue;
			}
			
			if(StateControl.getTurnState( targetUnit, state ) !== null )
			{
				score += 20 + targetUnit.getLv();
			}
		}
		
		return score;
	},

	_getStateScoreModeRecovery: function(unit, targetUnit, item) {
		var point;
		var score = 0;

		// 解除されるステート
		var delState = OT_getCustomItemDelState(item);

		// 追加されるステート
		var addState = OT_getCustomItemAddState(item);

		// ステートの追加
		for( var i=0 ; i<addState.length ; i++ )
		{
			var state = addState[i][0];
			
			// 味方にバッドステートを付与させるような事があった場合
			if( state.isBadState() )
			{
			}

			// 相手が既にそのステートを与えられている場合は、アイテムを使用しない
			if (StateControl.getTurnState(targetUnit, state) !== null) {
				continue;
			}
			
			point = StateScoreChecker.getScore(unit, targetUnit, state);

			if( point > -1 )
			{
				score += point;
			}
		}

		// ステートの解除
		for( var i=0 ; i<delState.length ; i++ )
		{
			var state = delState[i][0];

			// 味方のグッドステートを解除させるような事があった場合
			if( !state.isBadState() )
			{
				continue;
			}
			
			if(StateControl.getTurnState( targetUnit, state ) !== null )
			{
				score += 20 + targetUnit.getLv();
			}
		}
		
		return score;
	},
		
	_checkFilter: function(unit, filter) {
		var type = unit.getUnitType();
		
		if (filter & UnitFilterFlag.PLAYER) {
			if (type === UnitType.PLAYER) {
				return true;
			}
		}
		
		if (filter & UnitFilterFlag.ENEMY) {
			if (type === UnitType.ENEMY) {
				return true;
			}
		}
		
		if (filter & UnitFilterFlag.ALLY) {
			if (type === UnitType.ALLY) {
				return true;
			}
		}
		
		return false;
	},
		
	getActionTargetType: function(unit, item) {
		return ActionTargetType.OT_EFFECT_RANGE;
	}
}

);

function OT_ItemEffectRange_getCustomKeyword() {
	return 'OT_ItemEffectRange';
};


//----------------------------------------------------------
// 敵専用射程判定
//----------------------------------------------------------
var alias101 = CombinationCollector.Item._setCombination;
CombinationCollector.Item._setCombination = function(misc) {
	alias101.call(this, misc);

	var actionTargetType = misc.actionTargetType;
	
	if (actionTargetType === ActionTargetType.OT_EFFECT_RANGE) {
		CombinationCollector.Item.OT_setEffectRangeCombination(misc);
	}
};

CombinationCollector.Item.OT_setEffectRangeCombination = function(misc) {
	var i, j, k, x, y, indexArray, list, obj, targetUnit, targetCount, filter, listArray, listCount;
	var unit = misc.unit;
	var item = misc.item;
	var isIndifference = OT_getCustomItemIndifference(item);
	
	obj = ItemPackageControl.getItemAIObject(item);
	if (obj === null) {
		return;
	}

	filter = obj.getUnitFilter(unit, item);

	if (StateControl.isBadStateOption(unit, BadStateOption.BERSERK)) {
		if (filter & UnitFilterFlag.PLAYER) {
			filter = UnitFilterFlag.ENEMY;
		}
		else if (filter & UnitFilterFlag.ENEMY) {
			filter = UnitFilterFlag.PLAYER;
		}
		else if (filter & UnitFilterFlag.PARTNER) {
			filter = UnitFilterFlag.ENEMY;
		}
	}
	
	listArray = this._getTargetListArray(filter, misc);
	listCount = listArray.length;
	
	var startRange;
	var endRange;
	
	if (item.isWeapon()){
		startRange = item.getStartRange();
		endRange = item.getEndRange();
	}
	else{
		startRange = OT_getCustomItemEffectRangeMax(item);
		endRange = OT_getCustomItemEffectRangeMin(item);
	}
	
	misc.targetUnit = null;
	misc.indexArray = misc.simulator.getSimulationIndexArray();
	indexArray = misc.indexArray;
	var length = misc.indexArray.length;

	var simulator = root.getCurrentSession().createMapSimulator();
	simulator.startSimulation(unit, CurrentMap.getWidth() * CurrentMap.getHeight());
	simArray = simulator.getSimulationIndexArray();
	var count = simArray.length;
	
	if( misc.isMove )
	{
		//敵が移動するときのみは一番近い敵を検索する
		misc.actionTargetType = ActionTargetType.UNIT;
		this._setUnitCombination(misc);
		return;
	}

	var RangeIndexArray = Array();
	var InitRangeIndexArray = Array();
	var InitRangeIndexArray2 = Array();
	var MoveIndexArray = Array();
	var UnitIndexArray = Array();
	var SetIndexArray = Array();

	// targetUnit(自分ではなく相手)の現在位置をベースに、自分のアイテムで一連の攻撃可能範囲を求める
	for (i = 0; i < listCount; i++) {
		list = listArray[i];
		targetCount = list.getCount();
		for (j = 0; j < targetCount; j++) {
			targetUnit = list.getData(j);

			x = targetUnit.getMapX();
			y = targetUnit.getMapY();
			index = CurrentMap.getIndex(x, y);
			
			UnitIndexArray.push( index );
			
			//組み合わせを作成する
			//Array.prototype.push.apply( InitRangeIndexArray, OT_EffectRangeIndexArray.getAIEffectRangeItemIndexArray( x, y, item ) );
			
			// 正確性は若干欠けるが処理速度面で妥協
			Array.prototype.push.apply( InitRangeIndexArray, OT_EffectRangeIndexArray.getAIEffectRangeItemIndexArray2( x, y, item ) );
			Array.prototype.push.apply( InitRangeIndexArray, OT_EffectRangeIndexArray.getBestIndexArray( x, y, 0, 2 ) );
			
		}
	}

	var cnt = 0;
	RangeIndexArray = overlap(InitRangeIndexArray);
	var rangeLength = RangeIndexArray.length;

	// 密集地帯に敵が集まっているかを確認
	L: for (k = 0; k < length ; k++) {
		x = CurrentMap.getX(indexArray[k]);
		y = CurrentMap.getY(indexArray[k]);

		misc.targetUnit = null;
		misc.indexArray = [ indexArray[k] ];
		misc.costArray = this._createCostArray(misc);
		
		// 移動できる位置があるため、推定射程範囲内に相手がいるか確認する
		if (misc.costArray.length !== 0) {
			var array = OT_EffectRangeIndexArray.createIndexArray(x, y, item);
			Array.prototype.push.apply( array, RangeIndexArray );
			array = overlap(array);
			
			if(array.length > 0)
			{
				//組み合わせを作成する
				combination = this._createAndPushCombination(misc);
				combination.arrayRange = array;
				combination.single = false;
				combination.OT_EffectFlag = true;
				cnt++;
			}
		}
	}

	// 実際に移動できる位置からアイテムを使用して相手に当てられる可能性がある場所を検出する
	if( cnt == 0 )
	{
		RangeIndexArray = unique(InitRangeIndexArray);
		rangeLength = RangeIndexArray.length;

		L: for (k = 0; k < length ; k++) {
			x = CurrentMap.getX(indexArray[k]);
			y = CurrentMap.getY(indexArray[k]);
	
			misc.targetUnit = null;
			misc.indexArray = [ indexArray[k] ];
			misc.costArray = this._createCostArray(misc);
			
			// 移動できる位置があるため、推定射程範囲内に相手がいるか確認する
			if (misc.costArray.length !== 0) {
				var array = OT_EffectRangeIndexArray.createIndexArray(x, y, item);
				Array.prototype.push.apply( array, RangeIndexArray );
				array = overlap(array);
				
				if(array.length > 0)
				{
					//組み合わせを作成する
					combination = this._createAndPushCombination(misc);
					combination.arrayRange = array;
					combination.single = false;
					combination.OT_EffectFlag = true;
					//combination.single = true;
				}
			}
		}
	}
	//メモリを開放する
	delete InitRangeIndexArray;

};

// 敵がブロックに囲まれてる時のエラー対処
var alias102 = CombinationBuilder.createMoveCombinationArray;
CombinationBuilder.createMoveCombinationArray = function(misc) {
	misc.isMove = true;
	return alias102.call(this, misc);
};

//----------------------------------------------------------
// 便利な関数群
//----------------------------------------------------------
// 配列の重複を削除
function unique(array) {
	var storage = {};
	var uniqueArray = [];
	var i,value;
	for ( i=0; i<array.length; i++) {
		value = array[i];
		if (!(value in storage))
		{
			storage[value] = true;
			uniqueArray.push(value);
		}
	}
	return uniqueArray;
};

// 配列の重複を取得
function overlap(array) {
	var storage = {};
	var storage2 = {};
	var uniqueArray = [];
	var overlapArray = [];
	var i,value;
	for ( i=0; i<array.length; i++) {
		value = array[i];
		if ( !(value in storage) )
		{
			storage[value] = true;
		}
		else if( !(value in storage2) )
		{
			storage2[value] = true;
			overlapArray.push(value);
		}
	}
	return overlapArray;
};

// 配列同士を比較して重複を取得
function ArrayOverlap(array, array2) {
	var storage = {};
	var storage2 = {};
	var uniqueArray = [];
	var overlapArray = [];
	var i,value;
	for ( i=0; i<array.length; i++) {
		value = array[i];
		if( array2.indexOf(value) > 0 )
		{
			overlapArray.push(value);
		}
	}
	return overlapArray;
};

})();
