import { useState } from 'react'
import './styles.css'
import Header from './components/Header'
import Article from './components/Article'
import archivedArticles from './data/archivedArticles'
import favoritedArticles from './data/favoritedArticles'
import savedArticles from './data/savedArticles'
import trashedArticles from './data/trashedArticles'

export default function App() {
  const [articleQueue, setArticleQueue] = useState(savedArticles);
  const [favoritedArticles, setFavoritedArticles] = useState([]);
  const [archivedArticles, setArchivedArticles] = useState([]);
  const [trashedArticles, setTrashedArticles] = useState([]);

  const getStats = () => ({
    numOfFavorites: favoritedArticles.length,
    numOfArchived: archivedArticles.length,
    numOfTrashed: trashedArticles.length,
  });

  const getTargetArticle = (id) => savedArticles.find((item) => item.id === id);

  const removeFromSavedArticles = (targetArticle) => {
    const targetIndex = savedArticles.indexOf(targetArticle);
    savedArticles.splice(targetIndex, 1);
  };

  const handleFavorite = (id) => {
    const targetArticle = getTargetArticle(id);
    if (favoritedArticles.includes(targetArticle)) {
      const targetIndex = favoritedArticles.indexOf(targetArticle);
      favoritedArticles.splice(targetIndex, 1);
    } else {
      setFavoritedArticles([...favoritedArticles, targetArticle]);
    }
    setArticleQueue([...savedArticles]);
  };

  const handleArchive = (id) => {
    const targetArticle = getTargetArticle(id);
    removeFromSavedArticles(targetArticle);
    setArchivedArticles([...archivedArticles, targetArticle]);
    setArticleQueue([...savedArticles]);
  };

  const handleTrash = (id) => {
    const targetArticle = getTargetArticle(id);
    removeFromSavedArticles(targetArticle);
    if (favoritedArticles.includes(targetArticle)) {
      const targetIndex = favoritedArticles.indexOf(targetArticle);
      favoritedArticles.splice(targetIndex, 1);
    }
    setTrashedArticles([...trashedArticles, targetArticle]);
    setArticleQueue([...savedArticles]);
  };

  const handleToggleExpand = (id) => {
    const targetArticle = getTargetArticle(id);
    targetArticle.expanded = !targetArticle.expanded;
    setArticleQueue([...savedArticles]);
  };

  const handleClick = (e) => {
    const buttonType = e.target.dataset.buttonType;
    const articleId = e.target.dataset.articleId;

    switch (buttonType) {
      case "favorite":
        return handleFavorite(articleId);
      case "archive":
        return handleArchive(articleId);
      case "trash":
        return handleTrash(articleId);
      case "toggleExpand":
        return handleToggleExpand(articleId);
      default:
        return null;
    }
  };

  const articleComponents = articleQueue.map((articleData) => (
    <Article
      key={articleData.id}
      articleData={articleData}
      onClick={handleClick}
    />
  ));

  const noArticlesMessage = (
    <p className="no-articles-message">Burada gösterilecek makale yok.</p>
  );

  return (
    <div className="wrapper">
      <Header stats={getStats()} setArticleQueue={setArticleQueue} />
      <div className="articles-container" onClick={(e) => handleClick(e)}>
        {articleQueue.length > 0 ? articleComponents : noArticlesMessage}
      </div>
    </div>
  );
}

  /*-------------------------------------------------------------------------*/

  /* Challenge

    Her makale için bulunan dört buton da çalışmıyor. Göreviniz bunları aşağıdaki gibi ayarlamaktır: 
    
        1. "articles-container" div'ine tek bir onClick olay işleyicisi eklemelisiniz. Projeye başka hiçbir olay işleyici eklenmemelidir. Olay işleyici, aşağıdakileri yapmak için butonların "button-type" ve "article-id" data niteliklerini kullanmalıdır: 
          
         eğer butonun             O zaman butonun 
			   "button-type"          "article-id" veri değerini
			   data değeri:            aşağıdakileri yapmak için:      				   
		 	╷---------------------╷-----------------------------╷					
	    |      "favorite"     |	      favorite(idValue)     |
			|---------------------|-----------------------------|
			|      "archive"      |	    archive(idValue)        |
			|---------------------|-----------------------------|
			|       "trash"       |	      trash(idValue)        |
      |---------------------|-----------------------------|
			|    "toggleExpand"   |	  toggleExpand(idValue)     |	
			¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯	
			                      idValue = "article-id" data niteliğinin değeri. 
								            	 Bu sadece açıklama amaçlıdır - bu şekilde adlandırmak zorunda değilsiniz
			        
    2. Yukarıda listelenen ilk üç fonksiyon zaten çalışmaktadır ve değiştirilmemelidir. Ancak, toggleExpand fonksiyonu (satır 71) şu anda bozuk ve düzeltilmesi gerekiyor. Bunu düzeltmek için *sadece* çok küçük (ama önemli) bir değişiklik yapmanız gerekiyor. Sorunun tam olarak ne olduğunu ve çözümünüzün bunu neden düzelttiğini tanımlamaya ve ifade etmeye çalışın.  
		   
		3. Olay işleyicisi için kodunuz, okunabilirliği korurken mümkün olduğunca kısa ve DRY (Kendinizi Tekrar Etmeden) olmalıdır. 
		
		4. Doğru çalıştığından emin olmak için uygulamayı test etmelisiniz. Yukarıdaki görevleri tamamladıktan sonra, daha fazla butonuna tıkladığınızda bir makale genişlemeli, kalp şeklindeki favori butonuna tıkladığınızda açılıp kapanmalı ve arşiv veya çöp kutusu butonuna tıkladığınızda makale kaybolmalıdır. Uygulamanın üst kısmındaki sayılar da favorilere eklediğiniz, arşivlediğiniz veya çöpe attığınız makale sayısını yansıtmalıdır. 
		   
		Bonus Görev: Yukarıda listelenen dört fonksiyon kuruldukları şekilde çalışacak olsalar da (dördüncüyü düzelttikten sonra), alışılmışın dışında ve tartışmalı bir şekilde "yanlış" giden bir şey var - React Dokümantasyonunun karşı uyardığı bir şey. Bakalım ne olduğunu bulabilecek misiniz.  


		
 */

  