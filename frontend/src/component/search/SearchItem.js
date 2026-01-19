import React from 'react';

const SearchItem = ({ result, onClick }) => {
    return (
        <div 
            className="search-item"
            onClick={() => onClick(result)}
        >
            {result.type === 'topic' ? (
                <>
                    <div className="search-item-main">
                        <span className="topic-badge">TOPIC</span>
                        <strong>{result.nameVi}</strong> ({result.name})
                    </div>
                    <div className="search-item-desc">{result.description}</div>
                </>
            ) : (
                <>
                    <div className="search-item-main">
                        <span className="vocab-badge">VOCABULARY</span>
                        <strong>{result.english}</strong> - {result.vietnamese}
                    </div>
                    <div className="search-item-desc">Topic: {result.topic}</div>
                </>
            )}
        </div>
    );
};

export default SearchItem;
