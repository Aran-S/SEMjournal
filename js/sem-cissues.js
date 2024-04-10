$(document).ready(function() {
    loadCurrentIssues();
});

function loadCurrentIssues(){
    jQuery
        .ajax({
            url : API_GET_CURRENT_ISSUE,
            type : 'GET',
            contentType : false,
            dataType : 'json',
            async : true,
            success : function(data, responsestatus, request) {
                if(data.functionStatus.code == 200){
                    setCurrentIssueArticles(data.articleInfoList);
                    /*$('#volcoverimage').html(
                                     '<img src="volume/VolScreenshot.png" style="width:100%;height:250px;"/>'
                                    + '<a href="volume/VolumeIndex.pdf" download="VolumeIndex.pdf">'
                                    + 'Download'
                                    + '</a>');*/
                } else {
                    clearLoading();
                    $('#modalbody').html('Unable to retrieve current issue information, please refresh the page!');
                    $('#staticBackdrop').modal('show');
                }
            },
            error : function(data, error) {
                clearLoading();
                $('#modalbody').html('Unable to retrieve current issue information, please refresh the page!');
                $('#staticBackdrop').modal('show');
            }
        });
    return false;
}

function clearLoading(){
    $('#articles').html('');
    $('#volcoverimage').html('');
}

function setCurrentIssueArticles(articleInfoList){
   var rows = '';
   $.each(articleInfoList, function(idx){
       var article = articleInfoList[idx];
       rows = rows + getNewRow(article);
   });
   $('#articles').html(rows);
}

function getNewRow(article){
    var fileNameIndex = article.pdfPath.lastIndexOf("/") + 1;
    var pdfName = article.pdfPath.substr(fileNameIndex);
    var fileLink = S3_ARTICLES_BASE_PATH + article.pdfPath;
    var absImage = article.abstractImage;
    if(isNullOrEmpty(absImage)){
        absImage = 'images/art_no_img.png';
    }else{
         absImage = S3_ARTICLES_BASE_PATH + absImage;
     }
    return '<div class="row"><div class="col-md-12 pl-0""><h5><strong>'
    + '<a class="arttitle" href="article.html?artid=' + article.articleId + '">' + article.title + '</a></strong></h5></div>'
    + '<div class="row"><div class="col-md-12 mb-2">'
    //+ '<a href="#" class="pl-2">'+article.author+'</a>'
//    + '<span class="pl-1">'+ article.author + '</span>'
    + getAuthor(article.author)
    + '&nbsp;&nbsp;| <i class="fa fa-file-pdf-o pl-2" aria-hidden="true"></i>&nbsp;&nbsp;'
    + '<a href="'+fileLink+'" download="'+ pdfName +'" class="pl-2" target="_blank">Download PDF</a> &nbsp;&nbsp;'
    + getpageinfo(article)
    + getarticletype(article)
    + ' </div></div>'
    + '<div class="row"><div class="text-center col-md-3"><img class="mt-auto" src="'+ absImage + '" style="width:100%;height:150px;" alt="">'
    + '</div><div class="col-md-9"><p class="text-justify">'+ truncate(article.abstractMessage)
    + '<a class="ml-2" href="article.html?artid=' + article.articleId + '">View Article</a></p></div></div></div>'
    + '<hr>';
}

function getpageinfo(article){
    if(isNullOrEmpty(article.pageInfo)){
        return '';
    }
    return '| Pages: '+ article.pageInfo +'&nbsp;&nbsp;';
}

function getarticletype(article){
    if(isNullOrEmpty(article.articleType)){
        return '';
    }
    return '| Type: '+ article.articleType;
}

function getAuthor(authors){
    var authorsList = '';
    $.each(authors.split(/\|/), function (i, val) {
        var mlVal = 2;
        if(i === 0){
            mlVal = 0;
        }
        if (val) {
             authorsList = authorsList + '<i class="fa fa-user mr-1 ml-'+mlVal+'" aria-hidden="true"></i><span class="pl-1">'+ val + '</span>';
        }
    });
    return authorsList;
}

function getTestArticles(){
    var articleInfoList = [];
    var article = {};
    article.title='The Effect of miR-361-3p Targeting TRAF6 on Apoptosis of Multiple Myeloma Cells';
    article.author='U.K.Behera';
    article.pdfName = 'SEMJ Article.pdf';
    article.pdfPath = 'pdf/tenses_table.pdf';
    article.abstractImage='images/sample/2.png';
    article.abstractMessage = 'microRNA-361-3p (miR-361-3p) is involved in the carcinogenesis of oral cancer and pancreatic catheter adenocarcinoma, and has anti-carcinogenic effects on non-small cell lung cancer (NSCLC). However, its effect on multiple myeloma (MM) is less reported. Here, we found that upregulating the expression of miR-361-3p inhibited MM cell viability and promoted MM apoptosis. We measured expressions of tumor necrosis factor receptor-associated factor 6 (TRAF6).';
    articleInfoList.push(article);
    articleInfoList.push(article);
    articleInfoList.push(article);
    articleInfoList.push(article);
    return articleInfoList;
}