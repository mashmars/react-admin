import {Link} from 'react-router-dom'

const Pagination = ({totalPage, currentPage, handleCurrentPageChange}) => {   
    currentPage = Number(currentPage) || 1
    totalPage = Number(totalPage)
    
    let nextPage = currentPage + 1
    nextPage = nextPage >= totalPage ? totalPage : nextPage;
    let lastPage = totalPage 

    let prevPage = currentPage - 1
    prevPage = prevPage < 1 ? 1 : prevPage;
    let firstPage = 1
    
 

    //只显示5页 6 2
    const pages = []
    if (currentPage <= 3) {
        for(let i = 1; i <= (totalPage <= 5 ? totalPage : 5); i++){
            pages.push(i)
        }
    } else if (currentPage > 3 && totalPage <= (currentPage + 2)){     
        
        for(let i = totalPage - 4; i <= totalPage; i++){
            i = i || 1
            pages.push(i)
        }
    } else if (currentPage > 3 && totalPage > (currentPage + 2)){
        for(let i = currentPage - 2; i <= currentPage + 2; i++){
            pages.push(i)
        }
    }

    const PageItem = ({handleCurrentPageChange}) => {
        return (
            pages.map((page, index) => {
                return  currentPage == page ? 
                    <span className="current" key={index}>{page}</span> 
                    : <span className="page" key={index}>
                        <Link onClick={() => handleCurrentPageChange(page)}>{page}</Link>
                    </span>
            })
        )
    }
    
    return (
        <div className="pagination">
            {totalPage > 1 && currentPage > 1 &&
               <>
                <span className="first" key="first">
                    <Link onClick={() => handleCurrentPageChange(firstPage)}>&lt;</Link>
                </span>
        
                <span className="previous" key="prev">
                    <Link onClick={() => handleCurrentPageChange(prevPage)}>&lt;&lt;</Link>
                </span>
               </>
            }

            <PageItem handleCurrentPageChange={handleCurrentPageChange}/>

            {totalPage > 1 && currentPage != totalPage && 
                <>
                <span className="next" key="next">
                    <Link onClick={() => handleCurrentPageChange(nextPage)}>&gt;</Link>
                </span>

                <span className="last" key="last">
                    <Link  onClick={() => handleCurrentPageChange(lastPage)}>&gt;&gt;</Link>
                </span>
                </>
            }
        </div>
    )
}



export default Pagination