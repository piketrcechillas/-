
/*--------------------------------------------------------------------------
  
  マップに出撃禁止ユニットの設定を追加します。

  使用方法:
  マップ情報のカスタムパラメータにて
  { OT_NGSortie:{ ユニットID:フラグ, ユニットID:フラグ, … } }
  と設定する。
  フラグは0で出撃可、1で出撃禁止となります。
  
  ※マップに設定されたユニットの出撃禁止フラグは
    EventNGSortie.jsでのユニット毎の出撃禁止フラグ設定より優先されます
  
  作成者:
  o-to
  
  更新履歴:
  2015/9/6:新規作成
  
--------------------------------------------------------------------------*/

var OT_NGSortieColor = 0x006296;

(function() {

UnitSortieListScrollbar.playSelectSound = function() {
	var object = this.getObject();
	var isSelect = true;
	
	if (this._isForceSortie(object) || this._isNGForceSortie(object)) {
		isSelect = false;
	}
	else if (SceneManager.getActiveScene().getSortieSetting().getSortieCount() === root.getCurrentSession().getCurrentMapInfo().getSortieMaxCount()) {
		if (object.getSortieState() === SortieType.SORTIE) {
			isSelect = true;
		}
		else {
			isSelect = false;
		}
	}
	
	if (isSelect) {
		MediaControl.soundDirect('commandselect');
	}
	else {
		MediaControl.soundDirect('operationblock');
	}
};

var alias1 = UnitSortieListScrollbar._getSortieColor;
UnitSortieListScrollbar._getSortieColor = function(object) {
	if (this._isNGForceSortie(object)) {
		return OT_NGSortieColor;
	}

	return alias1.call(this, object);
};
	
UnitSortieListScrollbar._isNGForceSortie = function(object) {
	return SceneManager.getActiveScene().getSortieSetting().isNGForceSortie(object);
};

SortieSetting._setInitialUnitPos = function() {
	var i, unit;
	var list = PlayerList.getAliveList();
	var count = list.getCount();
	var maxCount = this._sortiePosArray.length;
	var sortieCount = 0;
	
	// 現在のマップの戦闘準備画面で一度でもセーブを行うと、isFirstSetupはfalseを返す
	if (!root.getMetaSession().isFirstSetup()) {
		// 現在のユニット位置を基準に、_sortiePosArrayのunitを初期化する
		this._arrangeUnitPos();
		return;
	}
	
	// 初めて戦闘準備画面が表示される場合は、後続の処理によって出撃状態が自動で設定される
	
	this._clearSortieList();
	
	// 強制出撃(位置指定あり)のユニットを、順に出撃状態にする
	for (i = 0; i < count && sortieCount < maxCount; i++) {
		unit = list.getData(i);
		if (this.isForceSortie(unit)) {
			if (this._sortieFixedUnit(unit)) {
				sortieCount++;
			}
		}
	}
	
	// 強制出撃(位置指定なし)のユニットを、順に出撃状態にする
	for (i = 0; i < count && sortieCount < maxCount; i++) {
		unit = list.getData(i);
		if (this.isForceSortie(unit) && unit.getSortieState() !== SortieType.SORTIE) {
			if (this._sortieUnit(unit)) {
				sortieCount++;
			}
		}
	}
	
	// 出撃禁止以外のユニットを、順に出撃状態にする
	for (i = 0; i < count && sortieCount < maxCount; i++) {
		unit = list.getData(i);
		if (!this.isNGForceSortie(unit) && unit.getSortieState() !== SortieType.SORTIE) {
			if (this._sortieUnit(unit)) {
				sortieCount++;
			}
		}
	}
	
};

var alias2 = SortieSetting.setSortieMark;
SortieSetting.setSortieMark = function(index) {
	var list = PlayerList.getAliveList();
	var unit = list.getData(index);
	
	if ( this.isNGForceSortie(unit) )
	{	
		//root.log( unit.getId() );
		return false;
	}
	
	return alias2.call(this, index);
};

SortieSetting.isNGForceSortie = function(unit) {	
	var i, forceSortie;
	var mapInfo = root.getCurrentSession().getCurrentMapInfo();
	var NGSortie = mapInfo.custom.OT_NGSortie;
	var NGSortieList = root.getMetaSession().global.OT_NGSortieList;

	// マップ設定でのキャラの出撃禁止確認
	if( NGSortie != null )
	{
		//root.log( unit.getId() );
		for (var j in NGSortie)
		{
			//root.log( j + NGSortie[j] );
			if( unit.getId() == j )
			{
				if( NGSortie[j] == 1 )
				{
					return true;
				}
				else if( NGSortie[j] == 0 )
				{
					return false;
				}
			}
		}
	}

	// イベント設定での出撃禁止キャラ
	if( NGSortieList != null )
	{
		for (var j in NGSortieList)
		{
			//root.log( j + NGSortieList[j] );
			if ( unit.getId() == j && NGSortieList[j] == 1 ) {
				return true;
			}
		}
	}
	
	return false;
};
	
})();

