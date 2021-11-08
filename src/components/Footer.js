import React from 'react'

const Footer = () => {
    return (
        <footer className="footer" style={{position: "relative", bottom: 0, height: 5, marginTop: '30px', pading: '40px'}}>
            <div className="container">
            <div className="content has-text-centered">
                <p>
                Made with <i className="material-icons love">Love</i> from{' '}
                <strong>Indonesia</strong>.
                </p>
            </div>
            </div>
        </footer>
    )
}

export default Footer
