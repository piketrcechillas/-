
/*--------------------------------------------------------------------------
  
  ※MapNGSortie.jsとセットで導入する事

  「スクリプトの実行」の「コードの実行」から
  ユニットの出撃禁止フラグを設定できるようになります。
  出撃禁止フラグが立ったキャラは出撃準備にて出撃選択が不可能になります
  出撃禁止で設定できるものは下記の通りです。

  ・個別で出撃禁止フラグを設定				SetNGSortieList( { ユニットID:フラグ, … } );
  ・全キャラ出撃禁止						AllNGSortieList();
  ・全キャラ出撃禁止フラグ解除				SetNGSortieList();
  ・出撃したキャラだけ出撃禁止にする		AddSortieNGSortieList();
  ・出撃していないキャラを出撃禁止にする	AddNonSortieNGSortieList();

  使用方法
  
  ※出撃禁止フラグ設定:
  イベントコマンドの「スクリプトの実行」で「コードの実行」にチェックし、
  テキスト領域に
  SetNGSortieList(
    { ユニットID:フラグ, ユニットID:フラグ, … }
  );
  のように記述します。
  フラグの部分は、1で出撃禁止、0で出撃禁止解除となります。
  
  例：ユニット番号0を出撃禁止、ユニット番号2を出撃禁止解除する
  SetNGSortieList(
    { 0:1, 2:0 }
  );

  ※全キャラ出撃禁止:
  テキスト領域にAllNGSortieList();と記述します。
  一部のキャラのみ出撃可(ただし強制ではない)にしたい時に
  AllNGSortieList()で全キャラを一旦出撃禁止にして
  SetNGSortieList({…})で個別で設定する事をオススメします。
  
  ※全キャラ出撃禁止フラグ解除:
  テキスト領域にSetNGSortieList();と記述します。

  ※出撃したキャラだけ出撃禁止にする:
  テキスト領域にAddSortieNGSortieList();と記述します。
  複数構成のマップで部隊を分けるというシチュエーションの時などに利用します。
  (使用する場合はマップクリア前に使用してください)

  ※出撃していないキャラを出撃禁止にする:
  テキスト領域にAddNonSortieNGSortieList();と記述します。
  複数構成のマップで出撃準備時に
  前マップで出撃したキャラだけを出撃可にしたい時に利用します。
  (使用する場合はマップクリア前に使用してください)

  作成者:
  o-to
  
  更新履歴:
  2015/9/6:新規作成
  2016/02/28:
  1.060対応、公式関数削除によってエラーとなっていたため修正
  
  2017/02/05:
  forループ用に使用している変数の宣言忘れしている箇所を修正
  ※同じように宣言忘れしている別スクリプトがあった場合、意図せぬ動作が起こるため

--------------------------------------------------------------------------*/

// 指定したユニットの出撃禁止状態を設定
function SetNGSortieList(aryList)
{
	//root.log( aryList );
	if( aryList != null )
	{
		if(root.getMetaSession().global.OT_NGSortieList == null)
		{
			root.getMetaSession().global.OT_NGSortieList = {};
		}
		
		for (var j in aryList)
		{
			//root.log( j + aryList[j]);
			root.getMetaSession().global.OT_NGSortieList[j] = aryList[j];
		}
	}
	else
	{
		root.getMetaSession().global.OT_NGSortieList = {};
	}
}

// 全ユニット出撃禁止
function AllNGSortieList()
{
	var list = PlayerList.getMainList();
	var count = list.getCount();
	root.getMetaSession().global.OT_NGSortieList = {};
	
	for (var i = 0; i < count ; i++) {
		root.getMetaSession().global.OT_NGSortieList[i] = 1;
	}

}

// その戦闘に参加した出撃ユニットを出撃禁止にする
function AddSortieNGSortieList()
{
	var list = PlayerList.getSortieList();
	var count = list.getCount();
	if(root.getMetaSession().global.OT_NGSortieList == null)
	{
		root.getMetaSession().global.OT_NGSortieList = {};
	}

	// 出撃ユニットを、出撃禁止状態にする
	for (var i = 0; i < count ; i++) {
		var unit = list.getData(i);
		root.getMetaSession().global.OT_NGSortieList[unit.getId()] = 1;
	}
}

// その戦闘に参加していないユニットを出撃禁止にする
function AddNonSortieNGSortieList()
{
	var list = PlayerList.getMainList();
	var count = list.getCount();
	if(root.getMetaSession().global.OT_NGSortieList == null)
	{
		root.getMetaSession().global.OT_NGSortieList = {};
	}

	// 出撃していないユニットを、出撃禁止状態にする
	for (var i = 0; i < count ; i++) {
		var unit = list.getData(i);
		
		if(unit.getSortieState() !== SortieType.SORTIE)
		{
			root.getMetaSession().global.OT_NGSortieList[unit.getId()] = 1;
		}
	}
}

